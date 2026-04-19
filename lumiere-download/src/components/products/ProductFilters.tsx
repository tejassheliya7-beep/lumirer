import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FilterState } from '@/types/product';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const ProductFilters = ({ filters, onFilterChange, onClearFilters }: ProductFiltersProps) => {
  const goldPurityOptions = ['14K', '18K', '22K'];
  const metalColorOptions = ['Yellow Gold', 'White Gold', 'Rose Gold', 'Two-Tone'];
  const diamondTypeOptions = ['VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2'];
  const diamondShapeOptions = ['Round', 'Princess', 'Cushion', 'Oval', 'Emerald', 'Pear', 'Marquise', 'Asscher', 'Heart'];

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: 'goldPurity' | 'metalColor' | 'diamondType' | 'diamondShape', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const hasActiveFilters = 
    filters.goldPurity.length > 0 || 
    filters.metalColor.length > 0 || 
    filters.diamondType.length > 0 ||
    filters.diamondShape.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000000;

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <span className="text-sm font-medium">Active Filters</span>
          <Button
            variant="ghost"
            size="sm"
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={onClearFilters}
          >
            Clear All
            <X className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      <Accordion type="multiple" defaultValue={['price', 'purity', 'metal', 'shape']} className="space-y-4">
        {/* Price Range */}
        <AccordionItem value="price" className="border-b border-border">
          <AccordionTrigger className="text-sm uppercase tracking-wider font-medium hover:no-underline">
            Price Range
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6">
            <div className="space-y-6">
              <Slider
                value={filters.priceRange}
                min={0}
                max={1000000}
                step={10000}
                onValueChange={(value) => updateFilter('priceRange', value)}
                className="w-full"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{formatPrice(filters.priceRange[0])}</span>
                <span className="text-muted-foreground">{formatPrice(filters.priceRange[1])}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Gold Purity */}
        <AccordionItem value="purity" className="border-b border-border">
          <AccordionTrigger className="text-sm uppercase tracking-wider font-medium hover:no-underline">
            Gold Purity
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6">
            <div className="space-y-3">
              {goldPurityOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <Checkbox
                    checked={filters.goldPurity.includes(option)}
                    onCheckedChange={() => toggleArrayFilter('goldPurity', option)}
                  />
                  <span className="text-sm group-hover:text-primary transition-colors">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Metal Color */}
        <AccordionItem value="metal" className="border-b border-border">
          <AccordionTrigger className="text-sm uppercase tracking-wider font-medium hover:no-underline">
            Metal Color
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6">
            <div className="space-y-3">
              {metalColorOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <Checkbox
                    checked={filters.metalColor.includes(option)}
                    onCheckedChange={() => toggleArrayFilter('metalColor', option)}
                  />
                  <span className="text-sm group-hover:text-primary transition-colors">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Diamond Shape */}
        <AccordionItem value="shape" className="border-b border-border">
          <AccordionTrigger className="text-sm uppercase tracking-wider font-medium hover:no-underline">
            Diamond Shape
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6">
            <div className="grid grid-cols-3 gap-2">
              {diamondShapeOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => toggleArrayFilter('diamondShape', option)}
                  className={`text-xs py-2 px-2 rounded-sm border transition-colors text-center ${
                    filters.diamondShape.includes(option)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-primary'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Diamond Clarity */}
        <AccordionItem value="diamond" className="border-b border-border">
          <AccordionTrigger className="text-sm uppercase tracking-wider font-medium hover:no-underline">
            Diamond Clarity
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6">
            <div className="space-y-3">
              {diamondTypeOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <Checkbox
                    checked={filters.diamondType.includes(option)}
                    onCheckedChange={() => toggleArrayFilter('diamondType', option)}
                  />
                  <span className="text-sm group-hover:text-primary transition-colors">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Availability */}
        <AccordionItem value="availability" className="border-b border-border">
          <AccordionTrigger className="text-sm uppercase tracking-wider font-medium hover:no-underline">
            Availability
          </AccordionTrigger>
          <AccordionContent className="pt-4 pb-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={filters.inStock}
                onCheckedChange={(checked) => updateFilter('inStock', checked)}
              />
              <span className="text-sm group-hover:text-primary transition-colors">
                In Stock Only
              </span>
            </label>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductFilters;
