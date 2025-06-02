import jwt
from django.contrib.auth.models import AnonymousUser
from apps.users.models import User
from django.conf import settings
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from urllib.parse import parse_qs
import logging

logger = logging.getLogger(__name__)


class JWTAuthMiddleware(BaseMiddleware):
    """
    Custom middleware to authenticate WebSocket connections using JWT tokens
    """
    
    def __init__(self, inner):
        super().__init__(inner)
    
    async def __call__(self, scope, receive, send):
        # Only process WebSocket connections
        if scope['type'] == 'websocket':
            # Get JWT token from connection
            token = self.get_token_from_scope(scope)
            
            if token:
                # Authenticate user with token
                user = await self.get_user_from_token(token)
                scope['user'] = user if user else AnonymousUser()
            else:
                scope['user'] = AnonymousUser()
        
        return await super().__call__(scope, receive, send)
    
    def get_token_from_scope(self, scope):
        """Extract JWT token from WebSocket scope"""
        # Method 1: From query parameters (most common)
        query_string = scope.get('query_string', b'').decode()
        if query_string:
            query_params = parse_qs(query_string)
            if 'token' in query_params:
                return query_params['token'][0]
        
        # Method 2: From subprotocols
        subprotocols = scope.get('subprotocols', [])
        for protocol in subprotocols:
            if protocol.startswith('token.'):
                return protocol.replace('token.', '')
        
        # Method 3: From headers
        headers = dict(scope.get('headers', []))
        auth_header = headers.get(b'authorization', b'').decode()
        if auth_header.startswith('Bearer '):
            return auth_header.split(' ')[1]
        
        return None
    
    @database_sync_to_async
    def get_user_from_token(self, token):
        """Validate JWT token and return user"""
        try:
            # Validate the access token
            access_token = AccessToken(token)
            
            # Get user ID from token
            user_id = access_token.get('user_id')
            
            # Fetch user from database
            user = User.objects.select_related().get(id=user_id)
            
            logger.info(f"WebSocket authenticated user: {user.email}")
            return user
            
        except (InvalidToken, TokenError, User.DoesNotExist) as e:
            logger.warning(f"WebSocket authentication failed: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Unexpected error in WebSocket auth: {str(e)}")
            return None