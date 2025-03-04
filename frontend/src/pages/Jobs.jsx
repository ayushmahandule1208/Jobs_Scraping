import { useState } from 'react';
import { Building, MapPin, Clock, Briefcase, DollarSign, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';

// Dummy data for job listings
const jobListings = [
  {
    id: 1,
    company: "Amazon",
    title: "Software Development Engineer",
    location: "Seattle, WA",
    type: "Full-time",
    salary: "$120,000 - $150,000",
    posted: "2 days ago",
    description: "Join Amazon's world-class engineering team to build scalable and innovative solutions.",
    logo: "https://logo.clearbit.com/amazon.com"
  },
  {
    id: 2,
    company: "Google",
    title: "Product Manager",
    location: "Mountain View, CA",
    type: "Full-time",
    salary: "$130,000 - $160,000",
    posted: "1 day ago",
    description: "Lead cross-functional teams to deliver impactful products at Google.",
    logo: "https://logo.clearbit.com/google.com"
  },
  {
    id: 3,
    company: "Microsoft",
    title: "Cloud Solutions Architect",
    location: "Redmond, WA",
    type: "Full-time",
    salary: "$140,000 - $170,000",
    posted: "3 days ago",
    description: "Design and implement cloud solutions using Microsoft Azure.",
    logo: "https://logo.clearbit.com/microsoft.com"
  },
  {
    id: 4,
    company: "Amazon",
    title: "Data Scientist",
    location: "Remote",
    type: "Full-time",
    salary: "$110,000 - $140,000",
    posted: "5 days ago",
    description: "Use data to drive decision-making and build machine learning models at Amazon.",
    logo: "https://logo.clearbit.com/amazon.com"
  },
  {
    id: 5,
    company: "Google",
    title: "UX Designer",
    location: "New York, NY",
    type: "Contract",
    salary: "$90,000 - $120,000",
    posted: "4 days ago",
    description: "Create intuitive and user-friendly designs for Google's products.",
    logo: "https://logo.clearbit.com/google.com"
  },
  {
    id: 6,
    company: "Microsoft",
    title: "Software Engineer",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$125,000 - $155,000",
    posted: "6 days ago",
    description: "Develop cutting-edge software solutions at Microsoft.",
    logo: "https://logo.clearbit.com/microsoft.com"
  }
];

const Jobs = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    company: [],
    location: [],
    type: []
  });

  // Extract unique filter options
  const companies = [...new Set(jobListings.map(job => job.company))];
  const locations = [...new Set(jobListings.map(job => job.location))];
  const types = [...new Set(jobListings.map(job => job.type))];

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter(item => item !== value)
        : [...prevFilters[filterType], value]
    }));
  };

  // Filter and search jobs
  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCompany = filters.company.length === 0 || filters.company.includes(job.company);
    const matchesLocation = filters.location.length === 0 || filters.location.includes(job.location);
    const matchesType = filters.type.length === 0 || filters.type.includes(job.type);

    return matchesSearch && matchesCompany && matchesLocation && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto flex gap-8">
        {/* Sidebar for Filters */}
        <div className="w-64 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Filter className="w-5 h-5 mr-2" /> Filters
          </h2>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Company Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Company</h3>
            {companies.map((company) => (
              <label key={company} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={filters.company.includes(company)}
                  onChange={() => handleFilterChange('company', company)}
                  className="form-checkbox h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded"
                />
                <span className="text-sm">{company}</span>
              </label>
            ))}
          </div>

          {/* Location Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Location</h3>
            {locations.map((location) => (
              <label key={location} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={filters.location.includes(location)}
                  onChange={() => handleFilterChange('location', location)}
                  className="form-checkbox h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded"
                />
                <span className="text-sm">{location}</span>
              </label>
            ))}
          </div>

          {/* Job Type Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Job Type</h3>
            {types.map((type) => (
              <label key={type} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={filters.type.includes(type)}
                  onChange={() => handleFilterChange('type', type)}
                  className="form-checkbox h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded"
                />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Job Listings */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-8">Job Listings</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-700"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={job.logo}
                    alt={`${job.company} logo`}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-white">{job.title}</h2>
                    <p className="text-sm text-gray-400">{job.company}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <DollarSign className="w-4 h-4 mr-2" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Posted {job.posted}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={() => setSelectedJob(job)}
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={selectedJob.logo}
                alt={`${selectedJob.company} logo`}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h2 className="text-xl font-semibold text-white">{selectedJob.title}</h2>
                <p className="text-sm text-gray-400">{selectedJob.company}</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{selectedJob.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Briefcase className="w-4 h-4 mr-2" />
                <span>{selectedJob.type}</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <DollarSign className="w-4 h-4 mr-2" />
                <span>{selectedJob.salary}</span>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <Clock className="w-4 h-4 mr-2" />
                <span>Posted {selectedJob.posted}</span>
              </div>
            </div>

            <p className="text-gray-300 mb-6">{selectedJob.description}</p>

            <div className="flex space-x-4">
              <Button
                className="bg-blue-600 hover:bg-blue-700 flex-1"
                onClick={() => {/* Handle job application */}}
              >
                Apply Now
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedJob(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;