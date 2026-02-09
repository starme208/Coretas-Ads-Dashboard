import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge, PlatformIcon } from "./index";
import { CampaignWithMetrics } from "@/lib/schema";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 5;

interface CampaignTableProps {
  campaigns: CampaignWithMetrics[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function CampaignTable({
  campaigns,
  currentPage,
  onPageChange,
}: CampaignTableProps) {
  const totalPages = Math.ceil(campaigns.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCampaigns = campaigns.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis-start");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-end");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const renderPagination = (showCount = true) => {
    if (campaigns.length <= ITEMS_PER_PAGE) {
      return null;
    }

    return (
      <div className={`p-6 ${showCount ? 'border-t' : 'border-b'} border-border`}>
        <Pagination className="w-full flex justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) {
                    onPageChange(currentPage - 1);
                  }
                }}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) => {
              if (page === "ellipsis-start" || page === "ellipsis-end") {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                );
              }

              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(page as number);
                    }}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) {
                    onPageChange(currentPage + 1);
                  }
                }}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {showCount && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Showing {startIndex + 1} to {Math.min(endIndex, campaigns.length)} of {campaigns.length} campaigns
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle px-4 sm:px-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[200px] sm:w-[250px]">Campaign</TableHead>
                <TableHead className="hidden sm:table-cell">Platform</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="text-right">Spend</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Impr.</TableHead>
                <TableHead className="text-right hidden lg:table-cell">Clicks</TableHead>
                <TableHead className="text-right hidden lg:table-cell">CTR</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCampaigns && paginatedCampaigns.length > 0 ? (
                paginatedCampaigns.map((campaign) => (
                  <TableRow key={campaign.id} className="group hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="text-foreground font-semibold text-sm sm:text-base">{campaign.name}</span>
                        <div className="flex items-center gap-2 mt-1 sm:hidden">
                          <PlatformIcon platform={campaign.platform} />
                          <span className="text-xs text-muted-foreground capitalize">{campaign.platform}</span>
                          <StatusBadge status={campaign.status} />
                        </div>
                        <span className="text-xs text-muted-foreground capitalize hidden sm:inline">{campaign.type.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground capitalize">
                        <PlatformIcon platform={campaign.platform} />
                        {campaign.platform}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <StatusBadge status={campaign.status} />
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs sm:text-sm">
                      ${Number(campaign.totalSpend).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs sm:text-sm hidden lg:table-cell">
                      {campaign.totalImpressions.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs sm:text-sm hidden lg:table-cell">
                      {campaign.totalClicks.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs sm:text-sm hidden lg:table-cell">
                      {Number(campaign.ctr).toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs sm:text-sm font-semibold text-green-600">
                      ${Number(campaign.totalConversionValue || 0).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    No campaigns found. Create one to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {renderPagination(true)}
    </>
  );
}
