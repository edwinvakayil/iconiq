import { OpenPanelComponent } from "@openpanel/nextjs";

const Analytics = () => {
  if (process.env.NODE_ENV !== "production") return null;

  return (
    <OpenPanelComponent
      clientId={process.env.CLIENT_ID ?? ""}
      clientSecret={process.env.SECRET_KEY ?? ""}
      trackScreenViews
    />
  );
};

export { Analytics };
