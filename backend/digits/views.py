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
import threading
import pickle
import sys

sys.path.insert(1, os.path.join(settings.BASE_DIR, 'neural_network/data'))
sys.path.insert(2, os.path.join(settings.BASE_DIR, 'neural_network'))
import data_loader
import network

image_limit = 3


class HandleRetraining(threading.Thread):

    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        training_data, validation_data, test_data = data_loader.load_data_wrapper()
        net = network.Network([784, 30, 10], cost=network.CrossEntropyCost)
        print(len(training_data[0]))
        model_accuracy = net.SGD(
            training_data=training_data,
            epochs=15,
            mini_batch_size=10,
            eta=0.1,
            lmbda=5,
            evaluation_data=validation_data,
            monitor_evaluation_cost=False,
            monitor_evaluation_accuracy=True,
            monitor_training_cost=False,
            monitor_training_accuracy=True,
        )

        net.save(settings.MODEL)


class ApiView(APIView):

    def post(self, request):
        try:
            if "label" in request.data:
                image = convert(request.data["picture"])
                label = request.data["label"]
                label_vector = np.zeros((10, 1))
                label_vector[label] = 1.0

                with open(settings.VERIFIED_PICTURES, "ab") as f:
                    pickle.dump((image, label_vector), f)

                message = ""
                if self.retraining_necessary():
                    message = "Model is now retraining."
                    HandleRetraining().start()

                return Response(message, status=status.HTTP_200_OK)
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

    def retraining_necessary(self):
        count = 0
        with open(settings.VERIFIED_PICTURES, "rb") as f:
            while True:
                try:
                    obj = pickle.load(f)
                    count += 1
                except EOFError:
                    break
        return count >= image_limit
