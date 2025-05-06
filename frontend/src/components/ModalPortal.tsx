import { createPortal } from 'react-dom';
import { ReactNode, useEffect, useState } from 'react';

interface ModalProtalProps {
  children: ReactNode;
}

const ModalPortal = ({ children }: ModalProtalProps) => {
  // const target = document.getElementById('modal-root');
  // console.log('target:', target); // targetが存在するか確認
  // return target ? createPortal(children, target) : null;
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const modalRoot = document.getElementById('modal-root');
    setTarget(modalRoot);
  }, []);

  return target ? createPortal(children, target) : null;
};

export default ModalPortal;
