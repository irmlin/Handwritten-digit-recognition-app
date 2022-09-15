from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from utils.base64_converter import convert
from neural_network import network
from django.conf import settings
import numpy as np
import json
import os

import pdb


class ApiView(APIView):
    def post(self, request):
        try:
            if "label" in request.data:
                image = convert(request.data["picture"]).tolist()
                # label_vector = np.zeros((10, 1))
                # label_vector[int(request.data["label"])] = 1.0
                label = request.data["label"]
                if os.path.isfile(settings.VERIFIED_PICTURES):
                    with open(settings.VERIFIED_PICTURES, "r+") as f:
                        file_data = json.load(f)
                        file_data["data"][0].append(image)
                        file_data["data"][1].append(label)
                        f.seek(0)
                        json.dump(file_data, f)
                else:
                    with open(settings.VERIFIED_PICTURES, 'w') as f:
                        dictionary = {"data": ([image], [label])}
                        json.dump(dictionary, f)

                return Response(status=status.HTTP_200_OK)
            else:
                image = convert(request.data["picture"])
                net = network.load(settings.MODEL)
                prediction = net.feedforward(image)
                return Response(prediction.reshape(prediction.shape[0]), status=status.HTTP_200_OK)
        except Exception as e:
            print(e)
            return Response(status=status.HTTP_400_BAD_REQUEST)

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
