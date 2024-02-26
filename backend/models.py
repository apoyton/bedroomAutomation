from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models

class SingletonModel(models.Model):

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        # Assuming there's only one instance of SystemStatus
        obj, created = cls.objects.get_or_create(pk=1)
        return obj


class SystemStatus(SingletonModel):
    window = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    fan = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    lights = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    securityArmed = models.BooleanField()
    securityBreached = models.BooleanField()