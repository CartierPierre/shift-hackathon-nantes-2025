import os
import json
from datetime import datetime

from pydantic import BaseModel

class Event(BaseModel):
    """
    Class representing an event in the agenda.
    """
    name : str
    time : datetime
    description : str
    persons : list


    def __init__(self, name, time : datetime, description, persons = []):
        super().__init__(name=name, time=time, description=description, persons=persons)
        self.name : str = name
        self.time : datetime = time
        self.description : str = description
        self.persons : list = persons


class Agenda(BaseModel):
    """
    Class representing an agenda.
    """
    name : str
    events : list[Event]

    def __init__(self, name):
        super().__init__(name=name, events=[])
        self.name = name
        self.events = []

    def add_event(self, event):
        """
        Add an event to the agenda.
        """
        self.events.append(event)

    def remove_event(self, event_name):
        """
        Remove an event from the agenda.
        """
        self.events = [event for event in self.events if event.name != event_name]

    def save(self):
        """
        Save the agenda to a file.
        """
        with open(f"./assets/{self.name}/agenda.json", "w") as f:
            json.dump(self.__dict__, f)

    def load(self):
        """
        Load the agenda from a file.
        """
        with open(f"./assets/{self.name}/agenda.json", "r") as f:
            data = json.load(f)
            self.name = data["name"]
            self.events = [Event(**event) for event in data["events"]]


def create_agenda(name):
    """
    Create a new agenda with the given name.
    """
    # Check if the name folder exists
    if os.path.exists(f"./assets/{name}"):
        agenda = Agenda(name)
        if os.path.exists(f"./assets/{name}/agenda.json"):
            agenda.load()
        else:
            agenda.save()
            print(f"Created agenda: {name}")
    else:
        print(f"The folder {name} does not exist.")


def add_event_to_agenda(agenda_name, event: Event):
    """
    Add an event to the agenda with the given name.
    """
    # Check if the name folder exists
    if os.path.exists(f"./assets/{agenda_name}"):
        agenda = Agenda(agenda_name)
        agenda.load()
        agenda.add_event(event)
        agenda.save()
    else:
        print(f"The folder {agenda_name} does not exist.")

def remove_event_from_agenda(agenda_name, event_name):
    """
    Remove an event from the agenda with the given name.
    """
    # Check if the name folder exists
    if os.path.exists(f"./assets/{agenda_name}"):
        agenda = Agenda(agenda_name)
        agenda.load()
        agenda.remove_event(event_name)
        agenda.save()
    else:
        print(f"The folder {agenda_name} does not exist.")

def get_agenda(agenda_name):
    """
    Get the agenda with the given name.
    """
    # Check if the name folder exists
    if os.path.exists(f"./assets/{agenda_name}"):
        agenda = Agenda(agenda_name)
        agenda.load()
        return agenda
    else:
        print(f"The folder {agenda_name} does not exist.")
        return None

