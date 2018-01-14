import json
from django.views.decorators.http import require_POST
from django.utils.crypto import get_random_string
from api.forms import CameraRegisterForm
from api.staticvars import KEY_LENGTH


def verify_key(func):
    """Decorator that verifies keys."""
    def verified(request, *args, **kwags):
        pass

    return verified

@require_POST
def register_camera(request, parentid):
    """Registers a camera."""
    form = CameraRegisterForm()

    camera = form.save()
    camera.refresh_from_db()
    camera.key = get_random_string(length=KEY_LENGTH)
    camera.parent = request.user.parent
    camera.save()

    return json.load(camera)