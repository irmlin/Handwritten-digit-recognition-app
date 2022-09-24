# Generated by Django 4.1.1 on 2022-09-24 10:35

from django.db import migrations, models
import ndarraydjango.fields
import numpy


class Migration(migrations.Migration):

    dependencies = [
        ('digits', '0005_digits'),
    ]

    operations = [
        migrations.CreateModel(
            name='ModelState',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('biases', ndarraydjango.fields.NDArrayField(dtype=numpy.float64, editable=True)),
                ('weights', ndarraydjango.fields.NDArrayField(dtype=numpy.float64, editable=True)),
                ('train_accuracy', models.FloatField(default=0.0)),
                ('test_accuracy', models.FloatField(default=0.0)),
                ('retrain_in', models.SmallIntegerField(default=5)),
            ],
        ),
        migrations.RenameField(
            model_name='digit',
            old_name='isTrainingDigit',
            new_name='is_training_digit',
        ),
    ]
