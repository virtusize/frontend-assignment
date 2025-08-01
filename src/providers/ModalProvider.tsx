import { lazy, useEffect } from "react";
import { useModalStore } from "../stores/useModalStore";
import Modal from "../components/shared/Modal";
import { useSearchParams } from "react-router-dom";

import { MODALIDS } from "../lib/constants";
import ConfirmDeleteModal from "../components/clients/modals/ConfirmDeleteModal";

const ClientForm = lazy(() => import("../components/clients/forms/ClientForm"));
const ViewClientModal = lazy(
  () => import("../components/clients/modals/ViewClientModal")
);

const ModalProvider = () => {
  const { modalId, props, setModalId, close } = useModalStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const urlModalId = searchParams.get("modal");
  const id = searchParams.get("id");

  useEffect(() => {
    if (urlModalId && modalId !== urlModalId) {
      setModalId(urlModalId);
    }
  }, [urlModalId]);

  useEffect(() => {
    if (modalId) {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("modal", modalId);
        if (props?.id) next.set("id", props.id);
        return next;
      });
    } else {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete("modal");
        next.delete("id");
        return next;
      });
    }
  }, [modalId]);

  const handleClose = () => {
    close();
  };

  const renderModal = () => {
    switch (modalId) {
      case MODALIDS.ADDCLIENT:
        return (
          <Modal isOpen={true} onClose={handleClose}>
            <ClientForm {...props} onSuccess={handleClose} />
          </Modal>
        );
      case MODALIDS.VIEWCLIENT:
        return (
          <Modal isOpen={true} onClose={handleClose}>
            <ViewClientModal id={id ?? props?.id} />
          </Modal>
        );
      case MODALIDS.EDITCLIENT:
        return (
          <Modal isOpen={true} onClose={handleClose}>
            <ClientForm {...props} onSuccess={handleClose} />
          </Modal>
        );
      case MODALIDS.CONFIRMDELETE:
        return (
          <Modal isOpen={true} onClose={handleClose}>
            <ConfirmDeleteModal clientId={props?.id} onSuccess={handleClose} />
          </Modal>
        );
      default:
        return null;
    }
  };

  return renderModal();
};

export default ModalProvider;
