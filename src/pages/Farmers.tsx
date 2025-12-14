import { useState } from 'react';
import { farmers } from '@/data/mockData';
import { getFieldsForFarmer } from '@/data/farmerFieldsData';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { RiskBadge } from '@/components/ui/RiskBadge';
import { FarmerFieldsModal } from '@/components/farmers/FarmerFieldsModal';
import { Search, LayoutGrid, List, MapPin, Wheat } from 'lucide-react';
import { Farmer } from '@/types';

export default function Farmers() {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredFarmers = farmers.filter(farmer => {
    const matchesSearch = 
      farmer.name.toLowerCase().includes(search.toLowerCase()) ||
      farmer.location.toLowerCase().includes(search.toLowerCase()) ||
      farmer.id.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === 'all' || farmer.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const cropIcons: Record<string, string> = {
    maize: '🌽',
    rice: '🌾',
    cassava: '🥔',
    wheat: '🌿',
    soybeans: '🫘',
  };

  const handleFarmerClick = (farmer: Farmer) => {
    setSelectedFarmer(farmer);
    setIsModalOpen(true);
  };

  const selectedFarmerFields = selectedFarmer ? getFieldsForFarmer(selectedFarmer.id) : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Farm Directory</h1>
        <p className="text-muted-foreground mt-1">Browse and search registered farmers. Click a name to view their fields.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, location, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-[180px] bg-card">
            <SelectValue placeholder="Filter by risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            onClick={() => setViewMode('grid')}
            className="px-3"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            onClick={() => setViewMode('list')}
            className="px-3"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        Showing {filteredFarmers.length} of {farmers.length} farmers
      </p>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFarmers.map((farmer, index) => (
            <div
              key={farmer.id}
              className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <button
                    onClick={() => handleFarmerClick(farmer)}
                    className="font-semibold text-foreground hover:text-primary transition-colors text-left"
                  >
                    {farmer.name}
                  </button>
                  <p className="text-sm text-muted-foreground">{farmer.id}</p>
                </div>
                <span className="text-2xl">{cropIcons[farmer.cropType]}</span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{farmer.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wheat className="w-4 h-4" />
                  <span className="capitalize">{farmer.cropType} • {farmer.farmSize} ha</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <ScoreBadge score={farmer.cropCuraScore} />
                <RiskBadge level={farmer.riskLevel} size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary/50 border-b border-border">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Farmer</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Location</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Crop</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Farm Size</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">CropCura Score</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {filteredFarmers.map((farmer) => (
                  <tr 
                    key={farmer.id} 
                    className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <button
                          onClick={() => handleFarmerClick(farmer)}
                          className="font-medium text-foreground hover:text-primary transition-colors text-left"
                        >
                          {farmer.name}
                        </button>
                        <p className="text-sm text-muted-foreground">{farmer.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-foreground">{farmer.location}</p>
                        <p className="text-sm text-muted-foreground">{farmer.region}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-foreground flex items-center gap-2">
                        {cropIcons[farmer.cropType]} {farmer.cropType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground">{farmer.farmSize} ha</td>
                    <td className="px-6 py-4">
                      <ScoreBadge score={farmer.cropCuraScore} />
                    </td>
                    <td className="px-6 py-4">
                      <RiskBadge level={farmer.riskLevel} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredFarmers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No farmers found matching your criteria
        </div>
      )}

      {/* Farmer Fields Modal */}
      <FarmerFieldsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        farmer={selectedFarmer}
        fields={selectedFarmerFields}
      />
    </div>
  );
}
