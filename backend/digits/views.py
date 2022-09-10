from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from utils.base64_converter import convert
from neural_network import network
import numpy as np

from .models import Digit
from .serializers import *


class ApiView(APIView):
    def post(self, request):
        image = convert(request.data["content"])
        net = network.load("neural_network/model_2.json")
        prediction = net.feedforward(image)
        return Response(np.argmax(prediction, axis=0) , status=status.HTTP_200_OK)


    # def test(request):
    # if request.method == 'GET':
    #     return Response("Labadiena")

    # elif request.method == 'POST':
    #     serializer = DigitSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(status=status.HTTP_201_CREATED)
    #
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
