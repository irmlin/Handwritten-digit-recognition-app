# Generated by Django 4.1.1 on 2022-09-24 13:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('digits', '0006_modelstate_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='modelstate',
            name='biases',
            field=models.TextField(null=True),
        ),
        migrations.AlterField(
            model_name='modelstate',
            name='weights',
            field=models.TextField(null=True),
        ),
    ]
