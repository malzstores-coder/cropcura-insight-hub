import { CropScan } from '@/types/fields';
import { FieldStatusBadge } from '@/components/fields/FieldStatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Droplets, Bug, AlertTriangle, CheckCircle, Leaf } from 'lucide-react';

interface ScannedCropsSectionProps {
  scans: CropScan[];
}

export function ScannedCropsSection({ scans }: ScannedCropsSectionProps) {
  if (scans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-8 sm:py-12 text-center px-4">
        <Leaf className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/30 mb-3 sm:mb-4" />
        <h3 className="text-base sm:text-lg font-medium text-muted-foreground mb-2">No Crop Scans Available</h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
          Crop health scans will appear here once satellite imagery analysis is performed on the fields.
        </p>
      </div>
    );
  }

  const getMoistureColor = (level: CropScan['moistureLevel']) => {
    switch (level) {
      case 'low': return 'text-orange-600 bg-orange-100';
      case 'optimal': return 'text-green-600 bg-green-100';
      case 'high': return 'text-blue-600 bg-blue-100';
    }
  };

  const getNDVIColor = (score: number) => {
    if (score >= 0.7) return 'text-green-600';
    if (score >= 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
        <div className="text-xs sm:text-sm text-muted-foreground">
          {scans.length} scan{scans.length !== 1 ? 's' : ''} from satellite imagery
        </div>
        
        {scans.map((scan) => (
          <Card key={scan.id} className="overflow-hidden">
            <div className="flex flex-col">
              {/* Scan Image - Full width on mobile, side on larger */}
              <div className="relative w-full h-32 sm:h-40 md:flex md:flex-row">
                <div className="md:w-44 lg:w-48 h-full flex-shrink-0 relative">
                  <img
                    src={scan.imageUrl}
                    alt={`Scan of ${scan.fieldName}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <FieldStatusBadge status={scan.healthStatus} />
                  </div>
                </div>
                
                {/* Details shown inline on md+ */}
                <CardContent className="hidden md:flex flex-1 p-3 lg:p-4 flex-col">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-sm lg:text-base text-foreground">{scan.fieldName}</h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        Scanned {scan.scanDate}
                      </p>
                    </div>
                  </div>
                  
                  {/* Metrics Row */}
                  <div className="flex flex-wrap gap-1.5 lg:gap-2 mb-2">
                    <Badge variant="outline" className={`${getNDVIColor(scan.ndviScore)} border-current text-[10px] lg:text-xs`}>
                      <Leaf className="w-2.5 h-2.5 lg:w-3 lg:h-3 mr-1" />
                      NDVI: {(scan.ndviScore * 100).toFixed(0)}%
                    </Badge>
                    <Badge variant="outline" className={`${getMoistureColor(scan.moistureLevel)} text-[10px] lg:text-xs`}>
                      <Droplets className="w-2.5 h-2.5 lg:w-3 lg:h-3 mr-1" />
                      {scan.moistureLevel.charAt(0).toUpperCase() + scan.moistureLevel.slice(1)}
                    </Badge>
                    {scan.pestDetection && (
                      <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200 text-[10px] lg:text-xs">
                        <Bug className="w-2.5 h-2.5 lg:w-3 lg:h-3 mr-1" />
                        Pests
                      </Badge>
                    )}
                  </div>
                  
                  {/* Disease Detection */}
                  {scan.diseaseDetection && (
                    <div className="flex items-start gap-2 mb-2 p-2 bg-destructive/10 rounded-md">
                      <AlertTriangle className="w-3 h-3 lg:w-4 lg:h-4 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-destructive">Disease Alert</p>
                        <p className="text-[10px] lg:text-xs text-destructive/80">{scan.diseaseDetection}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Recommendations - truncated on md */}
                  {scan.recommendations.length > 0 && (
                    <div className="mt-auto">
                      <p className="text-[10px] lg:text-xs font-medium text-muted-foreground mb-1">Recommendations:</p>
                      <ul className="space-y-0.5">
                        {scan.recommendations.slice(0, 2).map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-[10px] lg:text-xs text-foreground">
                            <CheckCircle className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-primary flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{rec}</span>
                          </li>
                        ))}
                        {scan.recommendations.length > 2 && (
                          <li className="text-[10px] lg:text-xs text-muted-foreground pl-4">
                            +{scan.recommendations.length - 2} more
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </div>
              
              {/* Mobile details - shown below image */}
              <CardContent className="md:hidden p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{scan.fieldName}</h4>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Calendar className="w-2.5 h-2.5" />
                      Scanned {scan.scanDate}
                    </p>
                  </div>
                </div>
                
                {/* Metrics Row - compact on mobile */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <Badge variant="outline" className={`${getNDVIColor(scan.ndviScore)} border-current text-[10px]`}>
                    <Leaf className="w-2.5 h-2.5 mr-0.5" />
                    {(scan.ndviScore * 100).toFixed(0)}%
                  </Badge>
                  <Badge variant="outline" className={`${getMoistureColor(scan.moistureLevel)} text-[10px]`}>
                    <Droplets className="w-2.5 h-2.5 mr-0.5" />
                    {scan.moistureLevel.charAt(0).toUpperCase() + scan.moistureLevel.slice(1)}
                  </Badge>
                  {scan.pestDetection && (
                    <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200 text-[10px]">
                      <Bug className="w-2.5 h-2.5 mr-0.5" />
                      Pests
                    </Badge>
                  )}
                </div>
                
                {/* Disease Detection - compact */}
                {scan.diseaseDetection && (
                  <div className="flex items-start gap-1.5 mb-2 p-1.5 bg-destructive/10 rounded-md">
                    <AlertTriangle className="w-3 h-3 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-medium text-destructive">Disease Alert</p>
                      <p className="text-[10px] text-destructive/80 line-clamp-2">{scan.diseaseDetection}</p>
                    </div>
                  </div>
                )}
                
                {/* Recommendations - limited on mobile */}
                {scan.recommendations.length > 0 && (
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground mb-1">Recommendations:</p>
                    <ul className="space-y-0.5">
                      {scan.recommendations.slice(0, 2).map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-1 text-[10px] text-foreground">
                          <CheckCircle className="w-2.5 h-2.5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{rec}</span>
                        </li>
                      ))}
                      {scan.recommendations.length > 2 && (
                        <li className="text-[10px] text-muted-foreground pl-3.5">
                          +{scan.recommendations.length - 2} more
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
