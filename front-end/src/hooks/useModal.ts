import { useState, useCallback } from 'react';

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
  buttonText?: string;
  onButtonClick?: () => void;
}

const initialState: ModalState = {
  isOpen: false,
  title: '',
  message: '',
  type: 'success',
};

export const useModal = () => {
  const [modalState, setModalState] = useState<ModalState>(initialState);

  const showModal = useCallback((
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' = 'success',
    buttonText?: string,
    onButtonClick?: () => void
  ) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type,
      buttonText,
      onButtonClick,
    });
  }, []);

  const hideModal = useCallback(() => {
    setModalState(initialState);
  }, []);

  return {
    modalState,
    showModal,
    hideModal,
  };
};
