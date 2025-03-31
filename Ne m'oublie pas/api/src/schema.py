import os
import json
from enum import Enum
from pydantic import BaseModel, Field


class RelationshipType(str, Enum):
    """
    Type of relation between the person and the elderly person.
    """
    FRIEND = "friend"
    FAMILY = "family"
    COLLEAGUE = "colleague"


class Person(BaseModel):
    """
    Class representing a person who can be a friend, family member, or carer of the elderly person.
    """
    id: int = Field(description="Unique identifier for the person")
    name: str = Field(description="First name")
    surname: str = Field(description="Last name")
    birthdate: str = Field(description="Date of birth in YYYY-MM-DD format")
    description: str = Field(description="Some background information about the person")
    annecdotes: list[str] = Field(default_factory=list, description="At least 10 anecdotes about the person")
    profile_picture_url: str
    relationship_type: RelationshipType = Field(description="The type of relationship between the person and the elderly person")
    relationship: str = Field(description="The relationship of the person to the elderly person")


class Event(BaseModel):
    """
    Class representing an event in the agenda.
    """
    id: int = Field(description="Unique identifier for the event")
    name: str = Field(description="Name of the event")
    date: str = Field(description="Time of the event in YYYY-MM-DD format")
    description: str = Field(description="Description of the event")
    annecdotes: list[str] = Field(default_factory=list, description="at least 10 anecdotes about the event")
    person_id: list[int] = Field(description="List of person IDs associated with the event")


class Image(BaseModel):
    """
    Class representing an image.
    """
    id: int = Field(description="Unique identifier for the image")
    title: str = Field(description="Title of the image")
    description: str = Field(description="Description of the image")
    date: str = Field(description="Date of the image in YYYY-MM-DD format")
    person_id: list[int] = Field(description="List of person IDs associated with the image")
    event_id: int | None = Field(default=None, description="Event ID associated with the image")
    url: str = Field(description="URL of the image")

class DB(BaseModel):
    """
    Base class for all models.
    """
    persons: list[Person] = Field(description="A list of persons")
    events: list[Event] = Field(description="A list of events")
    images: list[Image] = Field(description="A list of images")