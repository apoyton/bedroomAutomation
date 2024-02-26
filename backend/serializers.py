from rest_framework import serializers
from .models import *

class SystemStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemStatus
        fields = ['id', 'window', 'fan', 'lights', 'securityArmed', 'securityBreached']