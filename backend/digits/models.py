from django.db import models
from ndarraydjango.fields import NDArrayField
import numpy as np


class Digit(models.Model):
    picture = NDArrayField(shape=(784, 1), dtype=np.float64)
    label = models.SmallIntegerField(null=True)
    isTrainingDigit = models.BooleanField(default=True)


    @classmethod
    def create(cls, picture, label, isTrainingDigit):
        digit = cls(picture=picture, label=label, isTrainingDigit=isTrainingDigit)
        return digit

    def __str__(self):
        return str(self.label)
