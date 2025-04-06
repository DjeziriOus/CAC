import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useService } from "./useService";
import { useUpdateService } from "./useUpdateService";
import EditServiceForm from "./EditServiceForm";
import { useEffect } from "react";

function EditService() {
  const { serviceId } = useParams();
  const { service: serviceDetails, isPending, error } = useService();
  const { isUpdatingService, updateService } = useUpdateService();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (serviceDetails && location.hash) {
      const targetId = location.hash.substring(1); // Remove the '#' symbol
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location, serviceDetails]);
  const handleSubmit = async (formData) => {
    // Handle updating existing service
    updateService(serviceId, formData);
    // Redirect after success
    // TODO:
    // window.location.href = `/services/${serviceId}`;
    navigate(`/services`);
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <EditServiceForm
        initialService={serviceDetails}
        onSubmit={handleSubmit}
        isLoadingService={isPending}
        errorLoadingService={error}
        // TODO:
        // cancelUrl={`/services/${service.id}`}
        cancelUrl={`/services`}
      />
    </div>
  );
}

export default EditService;
