import { Toaster as BaseToaster, toast } from 'sonner';

export const Toaster = Object.assign(BaseToaster, {
  displayName: 'Toast',
});

export { toast };
