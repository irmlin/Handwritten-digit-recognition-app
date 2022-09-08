from django.db import models

class Digit(models.Model):
    picture = models.CharField("Picture", max_length=1000)

    def __str__(self):
        return self.picture
