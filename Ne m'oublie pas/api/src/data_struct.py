import os
import json
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field



class RelationshipType(str, Enum):
    """
    Enum representing the type of relationship between two persons.
    """
    FRIEND = "friend"
    FAMILY = "family"
    CARER = "carer"


class Person(BaseModel):
    """
    Class representing a person.
    """
    id: int
    name: str = Field(description="First name")
    surname: str = Field(description="Last name")
    birthdate: datetime
    description: str
    annecdotes: list[str]
    profile_picture_id: int
    relationship_type: RelationshipType
    relationship: str


    def __init__(self, name, email, birthdate: datetime, description, annecdotes=[]):
        super().__init__(name=name, email=email, birthdate=birthdate, description=description, annecdotes=annecdotes)
        self.id: int = 0
        self.name: str = name
        self.email: str = email
        self.birthdate: datetime = birthdate
        self.description: str = description
        self.annecdotes: list[str] = annecdotes

class Event(BaseModel):
    """
    Class representing an event in the agenda.
    """
    id: int
    name: str
    time: datetime
    description: str
    annecdotes: list[str]
    person_id: list[int]

    def __init__(self, name, time: datetime, description, person_id, annecdotes=[]):
        super().__init__(name=name, time=time, description=description, person_id=person_id, annecdotes=annecdotes)
        self.id: int = 0
        self.name: str = name
        self.time: datetime = time
        self.description: str = description
        self.annecdotes: list[str] = annecdotes
        self.person_id: list[int] = person_id


class Image(BaseModel):
    """
    Class representing an image.
    """
    id: int
    title: str
    description: str
    date: datetime
    person_id: list[int]
    event_id: int | None
    url: str

    def __init__(self, title, description, date: datetime, person_id, event_id, url=""):
        super().__init__(title=title, description=description, date=date, person_id=person_id, event_id=event_id, url=url)
        self.title: str = title
        self.description: str = description
        self.date: datetime = date
        self.person_id: list[int] = person_id
        self.event_id: int = event_id
        self.url: str = url
        self.id: int = 0


class DB(BaseModel):
    """
    Base class for all models.
    """
    persons: list[Person]
    events: list[Event]
    images: list[Image]

# class Event(BaseModel):
#     """
#     Class representing an event in the agenda.
#     """
#     id: int
#     name: str
#     time: datetime
#     description: str
#     persons: list

#     def __init__(self, name, time: datetime, description, persons=[]):
#         super().__init__(name=name, time=time, description=description, persons=persons)
#         self.name: str = name
#         self.time: datetime = time
#         self.description: str = description
#         self.persons: list = persons
