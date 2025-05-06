import { Request, Response } from 'express';
import Event from '../models/Event.js';

export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.find().sort({ updatedAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
};

export const addEvent = async (req: Request, res: Response): Promise<void> => {
  const { event, date } = req.body;
  try {
    const newEvent = new Event({ event, date });
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error adding event' });
  }
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event' });
  }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event' });
  }
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const { event } = req.body;
  try {
    const updateEvent = await Event.findByIdAndUpdate(
      id,
      { event },
      {
        new: true,
        runValidators: true, // スキーマのバリデーションを適用
        omitUndefined: true, // undefined のフィールドを無視
      }
    );

    if (!updateEvent) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.status(200).json(updateEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error patch event' });
  }
};
