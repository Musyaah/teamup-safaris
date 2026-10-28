"""
Django settings for the config project (Teamup Safaris backend).

Works on your laptop with no setup, and on a live server once you set the
environment variables listed below.

Environment variables used on the live server:
  DJANGO_SECRET_KEY      a long random string (never reuse the dev key)
  DJANGO_DEBUG           "False" on the live server
  DJANGO_ALLOWED_HOSTS   e.g. yourname.pythonanywhere.com  (comma separated)
  CORS_ALLOWED_ORIGINS   e.g. https://your-site.netlify.app (comma separated, no trailing slash)
  CSRF_TRUSTED_ORIGINS   e.g. https://yourname.pythonanywhere.com (comma separated)
"""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def env_list(name, default=""):
    return [item.strip() for item in os.environ.get(name, default).split(",") if item.strip()]


# --- Security ---------------------------------------------------------------

SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "django-insecure-local-development-only",
)

DEBUG = os.environ.get("DJANGO_DEBUG", "True") == "True"

if not DEBUG and SECRET_KEY.startswith("django-insecure"):
    raise RuntimeError("Set DJANGO_SECRET_KEY before running with DJANGO_DEBUG=False.")

ALLOWED_HOSTS = ["localhost", "127.0.0.1"] + env_list("DJANGO_ALLOWED_HOSTS")

CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS")


# --- Apps -------------------------------------------------------------------

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',
    'corsheaders',

    # Our app
    'bookings',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    # CORS must come before CommonMiddleware
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],  # holds templates/admin/base_site.html (admin look)
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'


# --- Database ---------------------------------------------------------------

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}


# --- Passwords --------------------------------------------------------------

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# --- Language and time ------------------------------------------------------

LANGUAGE_CODE = 'en-us'

# Kenyan time, so "today" and the booking times in admin match your clock.
TIME_ZONE = 'Africa/Nairobi'

USE_I18N = True

USE_TZ = True


# --- Static files (admin CSS) -----------------------------------------------

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedStaticFilesStorage"},
}


# --- Email (unchanged: prints to the terminal for now) ----------------------
# https://docs.djangoproject.com/en/6.1/topics/email/#topic-email-configuration

MAILERS = {
    'default': {
        'BACKEND': 'django.core.mail.backends.console.EmailBackend',
    },
}


# --- CORS: which websites may call this API ---------------------------------

CORS_ALLOWED_ORIGINS = env_list("CORS_ALLOWED_ORIGINS")

if DEBUG:
    # On your own computer, accept any port. Vite moves to 5174, 5175, 5177...
    # whenever the port it wants is already busy.
    CORS_ALLOWED_ORIGIN_REGEXES = [r"^http://(localhost|127\.0\.0\.1):\d+$"]


# --- API --------------------------------------------------------------------

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    # The public form needs no login, so skip session/CSRF handling on the API.
    "DEFAULT_AUTHENTICATION_CLASSES": [],
    # Slows down spam: one visitor can send at most 30 requests an hour.
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "30/hour",
    },
}


# --- Extra protection when live ---------------------------------------------

if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True