from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from digits.models import Digit
from digits.utils.utils import convert_bytes_to_grayscale
from digits.neural_network import network
from django.conf import settings

import os
import threading
import numpy as np
import sys

sys.path.insert(1, os.path.join(settings.BASE_DIR, 'digits/neural_network/data'))
sys.path.insert(2, os.path.join(settings.BASE_DIR, 'digits/neural_network'))
import data_loader
import network


class HandleRetraining(threading.Thread):

    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        training_data, validation_data, test_data = data_loader.load_data_wrapper()
        new_data = Digit.objects.all()
        training_data = self.append_verified_pictures(training_data, new_data)

        net = network.Network([784, 30, 10], cost=network.CrossEntropyCost)
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

    def append_verified_pictures(self, training_data, new_data):
        new_pictures = []
        new_labels = []

        for digit in new_data:
            new_pictures.append(digit.picture)
            label_vector = np.zeros((10,1))
            label_vector[digit.label] = 1.0
            new_labels.append(label_vector)

        new_data_pairs = list(zip(new_pictures, new_labels))

        return new_data_pairs + training_data

class ApiView(APIView):

    def post(self, request):
        try:
            picture = convert_bytes_to_grayscale(request.data["picture"])

            if "label" in request.data:
                label = request.data["label"]
                digit = Digit.create(picture, label)
                digit.save()

                retrain, count = self.__retraining_necessary()
                message = f"Picture verified ({count} total new images collected)."

                if retrain:
                    message += " Model is now retraining."
                    HandleRetraining().start()

                return Response(message, status=status.HTTP_200_OK)
            else:
                net = network.load(settings.MODEL)
                prediction = net.feedforward(picture)
                return Response(prediction.reshape(prediction.shape[0]), status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response(e, status=status.HTTP_400_BAD_REQUEST)

    def __retraining_necessary(self):
        count = Digit.objects.all().count()
        return (count % settings.IMAGE_LIMIT) == 0, count
