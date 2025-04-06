import { useEvent } from "./useEvent";
import EditEvenementForm from "./EditEvenementForm";

function EditEvenement() {
  const { event: eventDetails, isPending, error } = useEvent();

  return (
    <div className="container mx-auto px-4 py-8">
      <EditEvenementForm
        initialEvent={eventDetails}
        isLoadingEvent={isPending}
        errorLoadingEvent={error}
      />
    </div>
  );
}

export default EditEvenement;
