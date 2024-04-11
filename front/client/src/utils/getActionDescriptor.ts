import { Action } from '../enums';

export function getActionDescriptor(message: string): {
    action: Action;
    message: string;
  } {
    const normalizedMessage = message.trim().toLowerCase().replace(/\s/g, '');
    switch (normalizedMessage) {
      case '/up':
        return { action: Action.Up, message: '(going up)' };
      case '/down':
        return { action: Action.Down, message: '(going down)' };
      case '/left':
        return { action: Action.Left, message: '(going left)' };
      case '/right':
        return { action: Action.Right, message: '(going right)' };
      default:
        return { action: Action.Message, message };
    }
  }