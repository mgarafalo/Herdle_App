import { useSelector } from "react-redux";
import { useGetDashboardInfoQuery } from "../../../api/Queries/useGetDashboardInfoQuery/useGetDashboardInfoQuery";
import { AppState } from "../../../store/store";

export default function Dashboard() {
  const { id } = useSelector((store: AppState) => store.appState.user);
  const { data, isLoading, error } = useGetDashboardInfoQuery({ userId: id! });

  if (isLoading) {
    return <>Loading...</>;
  }
}
