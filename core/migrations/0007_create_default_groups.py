from django.db import migrations


def create_default_groups(apps, schema_editor):
    Group = apps.get_model("auth", "Group")

    for name in ("patient", "doctor"):
        Group.objects.get_or_create(name=name)


class Migration(migrations.Migration):
    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
        ("core", "0006_appointment_duration_minutes"),
    ]

    operations = [
        migrations.RunPython(create_default_groups, migrations.RunPython.noop),
    ]
