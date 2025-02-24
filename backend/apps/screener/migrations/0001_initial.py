# Generated by Django 5.1.6 on 2025-02-18 17:23

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='RSIAnalysis',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.DateTimeField()),
                ('symbol', models.CharField(max_length=10)),
                ('close', models.FloatField()),
                ('rsi', models.FloatField()),
                ('interval', models.CharField(max_length=5)),
                ('condition', models.CharField(max_length=10)),
            ],
        ),
    ]
