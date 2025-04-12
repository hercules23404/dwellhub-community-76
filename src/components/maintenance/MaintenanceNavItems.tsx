
import { Wrench } from "lucide-react";

export const TenantMaintenanceNavItem = () => (
  <li className="mt-2">
    <a
      href="/maintenance"
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
    >
      <Wrench className="h-4 w-4" />
      <span>Maintenance</span>
    </a>
  </li>
);

export const AdminMaintenanceNavItem = () => (
  <li className="mt-2">
    <a
      href="/admin/maintenance"
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
    >
      <Wrench className="h-4 w-4" />
      <span>Maintenance</span>
    </a>
  </li>
);
