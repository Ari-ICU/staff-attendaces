"use client";
import React, { createContext, useContext, useState, useMemo } from 'react';
import { Search, AlertCircle } from 'lucide-react';

// Staff data interface (matches your StaffList structure)
interface Staff {
  id: number;
  name: string;
  department: string;
  role: string;
  image: string;
}

// Employee interface for payroll
interface Employee extends Omit<Staff, 'image'> {
  hourlyRate: number;
  hoursWorked: number;
  empId: string;
}

interface ProcessedEmployee extends Employee {
  gross: number;
  tax: number;
  net: number;
  federalTax: number;
  stateTax: number;
  socialSecurity: number;
  medicare: number;
  overtimeHours: number;
  regularHours: number;
}

// Context for sharing staff data with auto-refresh capabilities
interface StaffContextType {
  staffData: Staff[];
  updateStaff: (staff: Staff[]) => void;
  isLoading: boolean;
  lastRefresh: Date;
  refreshStaffData: () => Promise<void>;
}

const StaffContext = createContext<StaffContextType | undefined>(undefined);

// Hook to use staff context
const useStaff = () => {
  const context = useContext(StaffContext);
  if (!context) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
};

// Function to load staff data from external source
const loadStaffData = async (): Promise<Staff[]> => {
  try {
    // In a real app, this would fetch from your staff file/database
    // For demo, we'll simulate loading from the StaffList component
    const response = await new Promise<Staff[]>((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: 'John Doe', department: 'IT', role: 'Developer', image: '/images/john.jpg' },
          { id: 2, name: 'Jane Smith', department: 'HR', role: 'Manager', image: '/images/jane.jpg' },
          { id: 3, name: 'Alice Johnson', department: 'Finance', role: 'Analyst', image: '/images/alice.jpg' },
          { id: 4, name: 'Bob Williams', department: 'Sales', role: 'Representative', image: '/images/bob.jpg' },
          { id: 5, name: 'Emma Brown', department: 'Marketing', role: 'Coordinator', image: '/images/emma.jpg' },
          // New staff members would appear here when added to staff file
        ]);
      }, 1000);
    });
    return response;
  } catch (error) {
    console.error('Failed to load staff data:', error);
    return [];
  }
};

// Staff Provider Component with auto-refresh
function StaffProvider({ children }: { children: React.ReactNode }) {
  const [staffData, setStaffData] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Auto-refresh staff data from external source
  const refreshStaffData = async () => {
    try {
      setIsLoading(true);
      const newStaffData = await loadStaffData();
      setStaffData(newStaffData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to refresh staff data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial data and set up auto-refresh
  React.useEffect(() => {
    refreshStaffData();
    
    // Auto-refresh every 30 seconds to check for new staff additions
    const interval = setInterval(refreshStaffData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const updateStaff = (newStaffData: Staff[]) => {
    setStaffData(newStaffData);
  };

  return (
    <StaffContext.Provider value={{ staffData, updateStaff, isLoading, lastRefresh, refreshStaffData }}>
      {children}
    </StaffContext.Provider>
  );
}

// Payroll Component that automatically syncs with staff file
function PayrollSection() {
  const { staffData, isLoading, lastRefresh, refreshStaffData } = useStaff();
  
  // Define hourly rates based on roles and departments
  const getRoleHourlyRate = (department: string, role: string) => {
    const rateMap: { [key: string]: number } = {
      'IT-Developer': 30.00,
      'HR-Manager': 35.00,
      'Finance-Analyst': 28.50,
      'Sales-Representative': 22.00,
      'Marketing-Coordinator': 25.00,
    };
    return rateMap[`${department}-${role}`] || 25.00;
  };

  // Convert staff data to employee data with default hours
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  // Update employees when staff data changes
  React.useEffect(() => {
    const employeeData = staffData.map(staff => ({
      id: staff.id,
      empId: `EMP${String(staff.id).padStart(3, '0')}`,
      name: staff.name,
      department: staff.department,
      role: staff.role,
      hourlyRate: getRoleHourlyRate(staff.department, staff.role),
      hoursWorked: 40 // Default 40 hours
    }));
    setEmployees(employeeData);
  }, [staffData]);
  
  const [payroll, setPayroll] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate payroll for an employee
  const calculatePayroll = (emp: Employee): ProcessedEmployee => {
    const regularHours = Math.min(40, emp.hoursWorked);
    const overtimeHours = Math.max(0, emp.hoursWorked - 40);
    const regularPay = regularHours * emp.hourlyRate;
    const overtimePay = overtimeHours * emp.hourlyRate * 1.5;
    const totalGross = regularPay + overtimePay;
    
    const federalTax = totalGross * 0.15;
    const stateTax = totalGross * 0.05;
    const socialSecurity = totalGross * 0.062;
    const medicare = totalGross * 0.0145;
    const totalTax = federalTax + stateTax + socialSecurity + medicare;
    
    return {
      ...emp,
      gross: totalGross,
      tax: totalTax,
      net: totalGross - totalTax,
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      overtimeHours,
      regularHours
    };
  };

  // Filter employees based on search
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.empId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const processed = employees.map(emp => calculatePayroll(emp));
    return {
      totalGross: processed.reduce((sum, emp) => sum + emp.gross, 0),
      totalNet: processed.reduce((sum, emp) => sum + emp.net, 0),
      totalTax: processed.reduce((sum, emp) => sum + emp.tax, 0),
      totalEmployees: processed.length
    };
  }, [employees]);

  const validateEmployee = (emp: Employee) => {
    if (emp.hoursWorked < 0 || emp.hoursWorked > 80) {
      return 'Hours must be between 0 and 80';
    }
    if (emp.hourlyRate <= 0) {
      return 'Hourly rate must be positive';
    }
    return '';
  };

  const updateEmployeeHours = (empId: string, hours: string) => {
    const hoursNum = parseFloat(hours) || 0;
    setEmployees(prev => {
      const newEmployees = prev.map(emp => 
        emp.empId === empId ? { ...emp, hoursWorked: hoursNum } : emp
      );
      
      // Validate
      const employee = newEmployees.find(e => e.empId === empId)!;
      const error = validateEmployee({ ...employee, hoursWorked: hoursNum });
      setErrors(prev => ({ ...prev, [empId]: error }));
      
      return newEmployees;
    });
  };

  const updateEmployeeRate = (empId: string, rate: string) => {
    const rateNum = parseFloat(rate) || 0;
    setEmployees(prev => prev.map(emp => 
      emp.empId === empId ? { ...emp, hourlyRate: rateNum } : emp
    ));
    
    // Clear error when updating
    if (errors[empId]) {
      setErrors(prev => ({ ...prev, [empId]: '' }));
    }
  };

  const runPayroll = async () => {
    // Validate all employees
    const newErrors: Record<string, string> = {};
    let hasErrors = false;
    
    employees.forEach(emp => {
      const error = validateEmployee(emp);
      if (error) {
        newErrors[emp.empId] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsProcessing(true);
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const now = new Date();
    const period = `${now.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric', 
      day: 'numeric' 
    })} - ${now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    })}`;

    const processedEmployees = employees.map(calculatePayroll);

    const payrollData = {
      id: `PAY${Date.now().toString().slice(-6)}_${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
      period,
      runDate: currentDate,
      employees: processedEmployees
    };

    // CRITICAL: Save to localStorage for reports component to pick up
    try {
      // Save as latest payroll data for immediate pickup
      localStorage.setItem('latestPayrollData', JSON.stringify(payrollData));
      
      // Also save to persistent history
      const existingHistory = localStorage.getItem('payrollReportsHistory');
      let history = [];
      if (existingHistory) {
        try {
          history = JSON.parse(existingHistory);
        } catch (e) {
          console.error('Error parsing existing history:', e);
          history = [];
        }
      }
      
      history.unshift(payrollData); // Add to beginning of array
      localStorage.setItem('payrollReportsHistory', JSON.stringify(history));
      
      console.log('Payroll data saved to localStorage:', payrollData);
      console.log('Updated history length:', history.length);
      
    } catch (error) {
      console.error('Error saving payroll data:', error);
    }

    setPayroll(payrollData);
    
    setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading staff data from staff file...</p>
          <p className="text-sm text-gray-500 mt-2">Checking for updates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center py-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl text-white">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Payroll Processing</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Process payroll for your team members with automated tax calculations
          </p>
          <p className="text-sm opacity-75 mt-2">
            Connected to Staff Directory - {staffData.length} staff members imported
          </p>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Staff', value: summary.totalEmployees, icon: '👥' },
            { label: 'Total Gross', value: `$${summary.totalGross.toFixed(2)}`, icon: '💵' },
            { label: 'Total Taxes', value: `$${summary.totalTax.toFixed(2)}`, icon: '📊' },
            { label: 'Total Net', value: `$${summary.totalNet.toFixed(2)}`, icon: '💰' }
          ].map((stat, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</h3>
              </div>
              <p className="text-lg sm:text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Data Source Info with Auto-Refresh */}
        <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl mr-3">🔄</span>
              <div>
                <div className="font-semibold">Auto-Sync with Staff File</div>
                <div className="text-sm opacity-80">
                  {staffData.length} staff members loaded • Last updated: {lastRefresh.toLocaleTimeString()}
                </div>
                <div className="text-xs mt-1 opacity-70">
                  Auto-refreshes every 30 seconds to detect new staff additions
                </div>
              </div>
            </div>
            <button
              onClick={refreshStaffData}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Syncing...
                </>
              ) : (
                <>
                  🔄 Refresh Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Staff Payroll Management</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredEmployees.map((emp) => {
              const preview = calculatePayroll(emp);
              const staffMember = staffData.find(s => s.id === emp.id);
              return (
                <div
                  key={emp.empId}
                  className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                    {/* Employee Info - shows image from StaffList if available */}
                    <div className="md:col-span-2">
                      <div className="flex items-center space-x-3">
                        {staffMember?.image ? (
                          <img
                            src={staffMember.image}
                            alt={emp.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-100"
                            onError={(e) => {
                              // Fallback to initials if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                          style={{ display: staffMember?.image ? 'none' : 'flex' }}
                        >
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{emp.name}</p>
                          <p className="text-xs text-gray-500">{emp.empId} • {emp.role}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Department */}
                    <div>
                      <p className="text-sm font-medium text-gray-700">{emp.department}</p>
                    </div>
                    
                    {/* Hourly Rate */}
                    <div>
                      <input
                        type="number"
                        placeholder="Rate/hr"
                        value={emp.hourlyRate || ''}
                        onChange={(e) => updateEmployeeRate(emp.empId, e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        step="0.25"
                        min="0"
                        disabled={isProcessing}
                      />
                    </div>
                    
                    {/* Hours Worked */}
                    <div>
                      <input
                        type="number"
                        placeholder="Hours"
                        value={emp.hoursWorked || ''}
                        onChange={(e) => updateEmployeeHours(emp.empId, e.target.value)}
                        className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 bg-white text-gray-900 ${
                          errors[emp.empId] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                        }`}
                        step="0.5"
                        min="0"
                        max="80"
                        disabled={isProcessing}
                      />
                      {errors[emp.empId] && (
                        <div className="flex items-center text-red-500 text-xs mt-1">
                          <AlertCircle size={12} className="mr-1" />
                          {errors[emp.empId]}
                        </div>
                      )}
                    </div>
                    
                    {/* Preview Calculations */}
                    <div className="text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Gross:</span>
                        <span className="font-medium">${preview.gross.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax:</span>
                        <span className="font-medium">${preview.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Net:</span>
                        <span className="font-medium text-green-600">${preview.net.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex justify-end">
                      {payroll && (
                        <div className="text-xs text-green-600 font-medium">
                          ✅ Processed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {filteredEmployees.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <span className="text-4xl mb-2 block">🔍</span>
                <p>No staff members found matching your search</p>
              </div>
            )}
          </div>

          {/* Run Payroll Button */}
          <button
            onClick={runPayroll}
            disabled={isProcessing || Object.values(errors).some(e => e !== '') || employees.length === 0}
            className={`mt-6 w-full px-6 py-4 rounded-xl shadow-lg font-semibold text-lg transition-all transform ${
              isProcessing || Object.values(errors).some(e => e !== '') || employees.length === 0
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Processing Payroll...
              </div>
            ) : (
              <span className="flex items-center justify-center">
                <span className="mr-2">🚀</span>
                Run Payroll Processing
              </span>
            )}
          </button>
        </div>

        {/* Processing Success Message */}
        {payroll && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <div className="font-semibold text-lg">Payroll Successfully Processed!</div>
                <div className="text-sm opacity-80">
                  Period: <strong>{payroll.period}</strong> • Run Date: {payroll.runDate}
                </div>
                <div className="text-xs mt-1 opacity-70">
                  {payroll.employees.length} employee{payroll.employees.length !== 1 ? 's' : ''} processed • Total Net Pay: ${payroll.employees.reduce((sum: number, emp: ProcessedEmployee) => sum + emp.net, 0).toFixed(2)}
                </div>
                <div className="text-xs mt-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full inline-block">
                  💾 Data saved to reports - Check Payroll History!
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Main App Component - only shows Payroll with StaffList data
function App() {
  return (
    <StaffProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Payroll Content with StaffList Data */}
        <PayrollSection />
      </div>
    </StaffProvider>
  );
}

export default App;

