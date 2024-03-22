from django.http import JsonResponse
from .models import SystemStatus
from .serializers import SystemStatusSerializer
from .imageProcessing import lookForHuman
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json

systemSecureState = {
    "windowOpen": False,
    "fan": 0,
    "lights": 0,
    "blinds": 0,
    "doorLocked": True,
    "securityArmed": True
}
systemUnarmedState = {
    "doorLocked": False,
    "securityArmed": False,
    "securityBreached": False
}

def home(request):
    return HttpResponse("Welcome Home!")

@api_view(['GET', 'PUT'])
def status(request):

    if request.method == 'GET':
        serializer = SystemStatusSerializer(SystemStatus.load())
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = SystemStatusSerializer(SystemStatus.objects.get(pk=1), data=request.data, partial=True)

        # Check if 'securityArmed' is changing
        if 'securityArmed' in request.data:
            print('security armed in request data')
            print(request.data)
            newArmedValue = request.data.get('securityArmed')
            if(newArmedValue):
                serializer = SystemStatusSerializer(SystemStatus.objects.get(pk=1), data=systemSecureState, partial=True)
            else:
                serializer = SystemStatusSerializer(SystemStatus.objects.get(pk=1), data=systemUnarmedState, partial=True)
        else:
            print(request.data)
            system_status = SystemStatus.objects.get(pk=1)
            if system_status.securityArmed == True:
                serializer = SystemStatusSerializer(SystemStatus.objects.get(pk=1), data={}, partial=True)



        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=400)
    
    else:
        return HttpResponse("Only GET and PUT requests allowed!")
    
@api_view(['POST'])
def imageProcessing(request):
    
    if request.method == 'POST':
        data = request.body
        #print(data)
        humanDetected = lookForHuman(data)

        if humanDetected:
            data = {"securityBreached": True}
            serializer = SystemStatusSerializer(SystemStatus.objects.get(pk=1), data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
        # Return a JSON response indicating success
            return JsonResponse({"message": "Human detected. System status updated."}, status=200)
        else:
            # Return a JSON response indicating no human detected
            return JsonResponse({"message": "No human detected."}, status=200)

    else:
        return JsonResponse({"error": "Only POST requests allowed!"}, status=405)