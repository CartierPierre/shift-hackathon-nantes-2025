from src.person_generation import generate_person_memory
from src.event_generation import generate_event_memory
from fastapi import FastAPI
from dotenv import load_dotenv
import os
import json
import uvicorn
from fastapi.responses import JSONResponse
from fastapi import Request
from fastapi.middleware.cors import CORSMiddleware
import random

from src.agenda import Agenda, Event, create_agenda, add_event_to_agenda, remove_event_from_agenda, get_agenda
from src.schema import Person, Event, Image, DB, RelationshipType


# Load environment variables from .env file
load_dotenv()
port = os.getenv("PORT")


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

path_to_DB = os.getenv("PATH_TO_DB")
print(f"PATH_TO_DB: {path_to_DB}")

if not os.path.exists(path_to_DB):
    os.makedirs(path_to_DB)
    with open(f"{path_to_DB}/data.json", "w") as f:
        db = DB()
        json.dump(db.dict(), f, indent=4)
        print(f"Created database at {path_to_DB}/data.json")
else:
    with open(f"{path_to_DB}/data.json", "r") as f:
        db = DB(**json.load(f))
        print(f"Loaded database from {path_to_DB}/data.json")
        print(f"Database already exists at {path_to_DB}/data.json")
        print(f"Database loaded with {len(db.persons)} persons, {len(db.events)} events, and {len(db.images)} images.")


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/connect")
def connect(request: Request):
    name = request.state.my_name
    print(f"Connecting to {name}")
    folders = os.listdir("./assets/")
    if name in folders:
        print(f"Folder {name} already exists.")
    else:
        os.mkdir(f"./assets/{name}")
        print(f"Created folder: {name}")
        create_agenda(name)
    return {"message": f"Connected to {name}"}

@app.get("/agenda")
def get_agenda_route(request: Request):
    name = request.state.my_name
    agenda : Agenda = get_agenda(name)
    if agenda:
        return {"agenda": agenda}
    else:
        return {"error": "Agenda not found"}

@app.post("/agenda")
def add_event_route(request: Request, event: Event):
    name = request.state.my_name
    agenda = get_agenda(name)
    if agenda:
        add_event_to_agenda(name, event)
        return {"message": "Event added successfully"}
    else:
        return {"error": "Agenda not found"}

@app.delete("/agenda")
def remove_event_route(request: Request, event_name: str):
    name = request.state.my_name
    agenda = get_agenda(name)
    if agenda:
        remove_event_from_agenda(name, event_name)
        return {"message": "Event removed successfully"}
    else:
        return {"error": "Agenda not found"}


@app.get("/image/{image_id}")
def get_image(image_id: int):
    """
    Get an image by its ID.
    """
    for image in db.images:
        if image.id == image_id:
            return {"image": image}
    return {"error": "Image not found"}

@app.get("/person/{person_id}")
def get_person(person_id: int):
    """
    Get a person by their ID.
    """
    images = []
    for image in db.images:
        if person_id in image.person_id:
            images.append(image)
    for image in images:
        image.person_id = [person.id for person in db.persons if person.id in image.person_id]

    for person in db.persons:
        if person.id == person_id:
            return {
                "person": person,
                "images": images,
            }
    return {"error": "Person not found"}

@app.get("/person/group/{group}")
def get_person_by_group(group: RelationshipType):
    """
    Get a person by their group.
    """
    persons = []
    images = []
    for person in db.persons:
        if person.relationship_type == group:
            persons.append(person)
            for image in db.images:
                if person.id in image.person_id:
                    if image not in images:
                        images.append(image)
                        image.person_id = [person.id for person in db.persons if person.id in image.person_id]
    return {
        "persons": persons,
        "images": images,
        }

@app.get("/souvenirdujour")
def get_souvenir_du_jour():
    """
    Get a souvenir of the day, it's a random event.
    """
    images = []
    if db.events:
        event = random.choice(db.events)
        for image in db.images:
            if event.id == image.event_id:
                images.append(image)
                image.person_id = [person.id for person in db.persons if person.id in image.person_id]
        event.person_id = [person.id for person in db.persons if person.id in event.person_id]

        if not images:
            return {"event": event, "image": None}
        imageofday = random.choice(images)

        return {"event": event, "image": imageofday}
    else:
        return {"error": "No events found"}


@app.get("/image/{image_id}/create")
def create_image(image_id: int):
    """
    Create a story about the event associated with the image.
    """
    annecdotes = []
    for image in db.images:
        if image.id == image_id:
            for event in db.events:
                if event.id == image.event_id:
                    annecdotes = event.annecdotes
                    my_event = event
                    break
            if not annecdotes:
                return {"error": "No annecdotes found for this image"}
            else:
                audio_url = generate_event_memory(my_event)
                return {"audio_url" : audio_url}
    return {"error": "Image not found"}

@app.get("/person/{person_id}/create")
def create_person(person_id: int):
    """
    Create a story about the person.
    """
    annecdotes = []
    my_person = None
    for person in db.persons:
        if person.id == person_id:
            annecdotes = person.annecdotes
            my_person = person
            break
    if not annecdotes:
        return {"error": "No annecdotes found for this person"}
    else:
        # IA generate story
        audio_url = generate_person_memory(person)
        return {"audio_url" : audio_url}
        return {}


# @app.middleware("http")
# async def check_headers(request: Request, call_next):
#     """
#     Middleware to check for the presence of the 'My-Name' header.
#     If the header is not present, return a 400 Bad Request response.
#     """
#     if "My-Name" not in request.headers:
#         return JSONResponse(status_code=400, content={"message": "Missing My-Name"})
#     # If the header is present, get him and set it in the request state
#     my_name = request.headers["My-Name"]

#     request.state.my_name = my_name
#     response = await call_next(request)
#     return response

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(port))

