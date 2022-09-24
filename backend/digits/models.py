from django.db import models
from ndarraydjango.fields import NDArrayField
import numpy as np


class Digit(models.Model):
    picture = NDArrayField(shape=(784, 1), dtype=np.float64)
    label = models.SmallIntegerField(null=True)
    is_training_digit = models.BooleanField(default=True)

    @classmethod
    def create(cls, picture, label, is_training_digit):
        digit = cls(picture=picture, label=label, is_training_digit=is_training_digit)
        return digit

    def __str__(self):
        return str(self.label)


class ModelState(models.Model):
    biases = models.TextField(null=True)
    weights = models.TextField(null=True)
    train_accuracy = models.FloatField(default=0.0)
    test_accuracy = models.FloatField(default=0.0)
    retrain_in = models.SmallIntegerField(default=5)

    @classmethod
    def create(cls, biases, weights, train_accuracy, test_accuracy, retrain_in):
        state = cls(biases, weights, train_accuracy, test_accuracy, retrain_in)
        return state