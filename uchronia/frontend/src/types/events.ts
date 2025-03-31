export interface Option {
  title: string;
  img: string;
  consequence: string;
  consequence_img_link: string;
  music_file: string;
}

export interface Event {
  id: string;
  title: string;
  image: string;
  date: string;
  description: string;
  options: Option[];
  isDone?: boolean;
  isDisabled?: boolean;
  music_file: string;
}

export type Events = Event[];
