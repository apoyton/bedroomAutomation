from django.http import JsonResponse
from .models import SystemStatus
from .serializers import SystemStatusSerializer
from .imageProcessing import lookForHuman
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json

def home(request):
    return HttpResponse("Welcome Home!")

@api_view(['GET', 'PUT'])
def status(request):

    if request.method == 'GET':
        serializer = SystemStatusSerializer(SystemStatus.load())
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = SystemStatusSerializer(SystemStatus.objects.get(pk=1), data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    else:
        return HttpResponse("Only GET and PUT requests allowed!")
    
@api_view(['POST'])
def imageProcessing(request):
    
    if request.method == 'POST':
        image = request.body
        humanDetected = lookForHuman(image)

        if humanDetected:
            data = {"securityBreached": True}
            serializer = SystemStatusSerializer(SystemStatus.objects.get(pk=1), data=data, partial=True)
            if serializer.is_valid():
                serializer.save()

        return HttpResponse("Good buddy")

    else:
        return HttpResponse("Only GET and PUT requests allowed!")