from rest_framework import serializers
from .models import *

class SystemStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemStatus
        fields = ['id', 'windowOpen', 'fanOn', 'lightsOn', 'blinds', 'doorLocked', 'securityArmed', 'securityBreached', 'temperature', 'humidity']