from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from digits.models import Digit, ModelState
from digits.utils.utils import convert_bytes_to_grayscale
from digits.neural_network import network
from django.conf import settings

import os
import threading
import numpy as np
import sys
import json

sys.path.insert(1, os.path.join(settings.BASE_DIR, 'digits/neural_network/data'))
sys.path.insert(2, os.path.join(settings.BASE_DIR, 'digits/neural_network'))
import data_loader
import network


class HandleRetraining(threading.Thread):

    def __init__(self):
        threading.Thread.__init__(self)

    def run(self):
        training_data_raw = Digit.objects.all().filter(is_training_digit=True)
        validation_and_test_data_raw = Digit.objects.all().filter(is_training_digit=False)
        training_data = self.prepare_data(training_data_raw)
        validation_and_test_data = self.prepare_data(validation_and_test_data_raw, is_test=True)
        # import pdb
        # pdb.set_trace()
        print("Retraining...")

        net = network.Network([784, 30, 10], cost=network.CrossEntropyCost)
        _, evaluation_accuracy, _, training_accuracy = net.SGD(
            training_data=training_data,
            epochs=15,
            mini_batch_size=10,
            eta=0.1,
            lmbda=5,
            evaluation_data=validation_and_test_data[:10000],
            monitor_evaluation_cost=False,
            monitor_evaluation_accuracy=True,
            monitor_training_cost=False,
            monitor_training_accuracy=True,
        )

        net.save(settings.MODEL, evaluation_accuracy=evaluation_accuracy, training_accuracy=training_accuracy)

    def prepare_data(self, raw_data, is_test=False):

        pictures, labels = [], []

        for digit in raw_data:
            pictures.append(digit.picture.reshape((784, 1)))
            if not is_test:
                label_vector = np.zeros((10,1))
                label_vector[digit.label] = 1.0
                labels.append(label_vector)
            else:
                labels.append(digit.label)

        return list(zip(pictures, labels))

class ApiView(APIView):

    def post(self, request):
        try:
            picture = convert_bytes_to_grayscale(request.data["picture"])

            if "label" in request.data:
                label = request.data["label"]
                digit = Digit.create(picture, label, True)
                digit.save()

                retrain, count = self.__retraining_necessary()
                message = f"Picture verified ({count} total new images collected)."

                if retrain:
                    message += " Model is now retraining."
                    HandleRetraining().start()

                return Response(message, status=status.HTTP_200_OK)
            else:
                json_dec = json.decoder.JSONDecoder()
                state = ModelState.objects.all()[0]
                biases = json_dec.decode(state.biases)
                weights = json_dec.decode(state.weights)
                net = network.load(biases, weights)
                prediction = net.feedforward(picture)
                return Response(prediction.reshape(prediction.shape[0]), status=status.HTTP_200_OK)

        except Exception as e:
            print(e)
            return Response(e, status=status.HTTP_400_BAD_REQUEST)

    def __retraining_necessary(self):
        count = Digit.objects.all().count()
        return (count % settings.IMAGE_LIMIT) == 0, count
