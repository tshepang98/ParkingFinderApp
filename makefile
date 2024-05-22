install: venv
	python3 -m virtualenv venv; . venv/bin/activate; pip3 install -Ur requirements.txt

venv:
	test -d venv || python3 -m venv venv

run:
	@python manage.py runserver

clean:
	rm -rf venv

