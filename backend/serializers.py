from rest_framework import serializers
from .models import *

class SystemStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemStatus
        fields = ['id', 'windowOpen', 'fan', 'lights', 'blinds', 'doorLocked', 'securityArmed', 'securityBreached']