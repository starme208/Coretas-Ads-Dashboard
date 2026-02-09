"""Retry utility with exponential backoff."""
import time
from typing import Callable, TypeVar, Optional
from functools import wraps
from utils.logger import get_logger

logger = get_logger(__name__)

T = TypeVar('T')


def retry_with_backoff(
    max_retries: int = 3,
    initial_delay: float = 1.0,
    backoff_factor: float = 2.0,
    exceptions: tuple = (Exception,),
):
    """
    Decorator for retrying functions with exponential backoff.
    
    Args:
        max_retries: Maximum number of retry attempts
        initial_delay: Initial delay in seconds
        backoff_factor: Multiplier for delay after each retry
        exceptions: Tuple of exceptions to catch and retry on
    """
    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @wraps(func)
        def wrapper(*args, **kwargs) -> T:
            delay = initial_delay
            last_exception = None
            
            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    last_exception = e
                    if attempt < max_retries:
                        logger.warning(
                            f"Attempt {attempt + 1}/{max_retries + 1} failed for {func.__name__}: {e}. "
                            f"Retrying in {delay:.2f} seconds..."
                        )
                        time.sleep(delay)
                        delay *= backoff_factor
                    else:
                        logger.error(
                            f"All {max_retries + 1} attempts failed for {func.__name__}: {e}"
                        )
            
            # If we get here, all retries failed
            raise last_exception
        
        return wrapper
    return decorator


def retry_on_http_error(
    max_retries: int = 3,
    initial_delay: float = 1.0,
    backoff_factor: float = 2.0,
    status_codes: tuple = (429, 500, 502, 503, 504),
):
    """
    Decorator for retrying HTTP requests on specific status codes.
    
    Args:
        max_retries: Maximum number of retry attempts
        initial_delay: Initial delay in seconds
        backoff_factor: Multiplier for delay after each retry
        status_codes: Tuple of HTTP status codes to retry on
    """
    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @wraps(func)
        def wrapper(*args, **kwargs) -> T:
            delay = initial_delay
            last_exception = None
            
            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    # Check if it's an HTTP error with retryable status code
                    status_code = getattr(e, 'status_code', None)
                    if status_code in status_codes:
                        if attempt < max_retries:
                            logger.warning(
                                f"HTTP {status_code} error on attempt {attempt + 1}/{max_retries + 1} "
                                f"for {func.__name__}. Retrying in {delay:.2f} seconds..."
                            )
                            time.sleep(delay)
                            delay *= backoff_factor
                            continue
                    
                    # If not retryable or max retries reached, raise
                    raise
            
            # If we get here, all retries failed
            raise last_exception
        
        return wrapper
    return decorator
