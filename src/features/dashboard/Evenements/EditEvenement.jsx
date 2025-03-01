import { useNavigate, useParams } from "react-router-dom";
import { useEvent } from "./useEvent";
import { useState } from "react";
import { useUpdateEvent } from "./useUpdateEvent";
import EditEvenementForm from "./EditEvenementForm";

function EditEvenement() {
  const { eventId } = useParams();
  const { event: eventDetails, isPending, error } = useEvent();
  const { isUpdatingEvent, updateEvent } = useUpdateEvent();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    // Handle updating existing event
    updateEvent(eventId, formData);
    // Redirect after success
    // TODO:
    // window.location.href = `/events/${eventId}`;
    navigate(`/evenements`);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Modifier un événement</h1>
      <EditEvenementForm
        initialEvent={eventDetails}
        onSubmit={handleSubmit}
        isLoadingEvent={isPending}
        errorLoadingEvent={error}
        // TODO:
        // cancelUrl={`/evenements/${event.id}`}
        cancelUrl={`/evenements`}
      />
    </div>
  );
}

export default EditEvenement;
