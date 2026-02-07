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
      <div className="flex flex-col items-center justify-center h-full py-12 text-center">
        <Leaf className="w-16 h-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No Crop Scans Available</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
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
      <div className="p-4 space-y-4">
        <div className="text-sm text-muted-foreground mb-4">
          {scans.length} scan{scans.length !== 1 ? 's' : ''} from satellite imagery analysis
        </div>
        
        {scans.map((scan) => (
          <Card key={scan.id} className="overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* Scan Image */}
              <div className="sm:w-48 h-40 sm:h-auto relative flex-shrink-0">
                <img
                  src={scan.imageUrl}
                  alt={`Scan of ${scan.fieldName}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <FieldStatusBadge status={scan.healthStatus} />
                </div>
              </div>
              
              {/* Scan Details */}
              <CardContent className="flex-1 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{scan.fieldName}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      Scanned {scan.scanDate}
                    </p>
                  </div>
                </div>
                
                {/* Metrics Row */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline" className={`${getNDVIColor(scan.ndviScore)} border-current`}>
                    <Leaf className="w-3 h-3 mr-1" />
                    NDVI: {(scan.ndviScore * 100).toFixed(0)}%
                  </Badge>
                  <Badge variant="outline" className={getMoistureColor(scan.moistureLevel)}>
                    <Droplets className="w-3 h-3 mr-1" />
                    {scan.moistureLevel.charAt(0).toUpperCase() + scan.moistureLevel.slice(1)} Moisture
                  </Badge>
                  {scan.pestDetection && (
                    <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                      <Bug className="w-3 h-3 mr-1" />
                      Pests Detected
                    </Badge>
                  )}
                </div>
                
                {/* Disease Detection */}
                {scan.diseaseDetection && (
                  <div className="flex items-start gap-2 mb-3 p-2 bg-destructive/10 rounded-md">
                    <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-destructive">Disease Alert</p>
                      <p className="text-xs text-destructive/80">{scan.diseaseDetection}</p>
                    </div>
                  </div>
                )}
                
                {/* Recommendations */}
                {scan.recommendations.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Recommendations:</p>
                    <ul className="space-y-1">
                      {scan.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-foreground">
                          <CheckCircle className="w-3 h-3 text-primary flex-shrink-0 mt-0.5" />
                          {rec}
                        </li>
                      ))}
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
