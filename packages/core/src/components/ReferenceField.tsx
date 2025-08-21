import React, { useEffect, useState, useMemo } from "react";
import { cn } from "../utils/cn";

export interface ReferenceData {
  id: string | number;
  [key: string]: any;
}

export interface ReferenceFieldProps {
  /** The reference ID(s) to display */
  children?: React.ReactNode;

  /** The reference value (ID or array of IDs) */
  value?: string | number | (string | number)[] | null;

  /** The resource type to reference */
  reference: string;

  /** The field to display from the referenced resource */
  source?: string;

  /** Custom renderer for the reference data */
  render?: (data: ReferenceData | ReferenceData[]) => React.ReactNode;

  /** Whether to show loading state while fetching */
  showLoading?: boolean;

  /** Whether to show error state if fetch fails */
  showError?: boolean;

  /** Custom loading component */
  loadingComponent?: React.ComponentType;

  /** Custom error component */
  errorComponent?: React.ComponentType;

  /** CSS class names for the container */
  className?: string;

  /** CSS class names for the content */
  contentClassName?: string;

  /** Whether the field is required (for accessibility) */
  required?: boolean;

  /** Custom styling for loading state */
  loadingClassName?: string;

  /** Custom styling for error state */
  errorClassName?: string;

  /** Whether to show multiple references as a list */
  showAsList?: boolean;

  /** Separator for multiple references */
  separator?: string;

  /** Maximum number of references to display */
  maxItems?: number;

  /** Text to show when no references are found */
  emptyText?: string;

  /** Whether to show a link to the referenced resource */
  showLink?: boolean;

  /** Custom link renderer */
  linkRenderer?: (id: string | number, data: ReferenceData) => React.ReactNode;

  /** Data provider function for fetching references */
  dataProvider?: {
    getOne: (resource: string, id: string | number) => Promise<ReferenceData>;
    getMany?: (
      resource: string,
      ids: (string | number)[],
    ) => Promise<ReferenceData[]>;
  };
}

/**
 * A field component that displays references to other resources with
 * support for single and multiple references, loading states, and error handling.
 *
 * @example
 * // Single reference
 * <ReferenceField
 *   value="123"
 *   reference="users"
 *   source="name"
 * />
 *
 * @example
 * // Multiple references with custom rendering
 * <ReferenceField
 *   value={["123", "456"]}
 *   reference="posts"
 *   render={(data) => (
 *     <ul>
 *       {data.map(post => <li key={post.id}>{post.title}</li>)}
 *     </ul>
 *   )}
 * />
 *
 * @example
 * // With data provider integration
 * <ReferenceField
 *   value="789"
 *   reference="products"
 *   source="name"
 *   dataProvider={dataProvider}
 *   showLink
 * />
 */
export const ReferenceField: React.FC<ReferenceFieldProps> = ({
  children,
  value,
  reference,
  source = "id",
  render,
  showLoading = true,
  showError = true,
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  className,
  contentClassName,
  required = false,
  loadingClassName,
  errorClassName,
  showAsList = false,
  separator = ", ",
  maxItems,
  emptyText = "No references found",
  showLink = false,
  linkRenderer,
  dataProvider,
}) => {
  // State management
  const [data, setData] = useState<ReferenceData | ReferenceData[] | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Memoize derived values to prevent infinite re-renders
  const { isMultiple, referenceIds, validIds } = useMemo(() => {
    const isMultiple = Array.isArray(value);
    const referenceIds = isMultiple ? value : [value];
    const validIds = referenceIds.filter((id) => id != null && id !== "");
    return { isMultiple, referenceIds, validIds };
  }, [value]);

  // Fetch reference data
  useEffect(() => {
    if (!dataProvider || validIds.length === 0) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Filter out null/undefined values and ensure type safety
        const filteredIds = validIds.filter(
          (id): id is string | number => id != null && id !== "",
        ) as (string | number)[];

        if (isMultiple && dataProvider.getMany) {
          // Fetch multiple references
          const results = await dataProvider.getMany(reference, filteredIds);
          setData(results);
        } else {
          // Fetch single reference or fallback to multiple single requests
          if (filteredIds.length === 1) {
            const result = await dataProvider.getOne(reference, filteredIds[0]);
            setData(result);
          } else {
            const results = await Promise.all(
              filteredIds.map((id) => dataProvider.getOne(reference, id)),
            );
            setData(results);
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch reference data"),
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataProvider, reference, validIds, isMultiple]);

  // Handle loading state
  if (loading && showLoading) {
    if (LoadingComponent) {
      return <LoadingComponent />;
    }

    return (
      <div
        className={cn("reference-field-loading", loadingClassName)}
        data-testid="reference-field-loading"
      >
        <span className="loading-spinner">Loading...</span>
      </div>
    );
  }

  // Handle error state
  if (error && showError) {
    if (ErrorComponent) {
      return <ErrorComponent />;
    }

    return (
      <div
        className={cn("reference-field-error", errorClassName)}
        data-testid="reference-field-error"
      >
        <span className="error-message">Error: {error.message}</span>
      </div>
    );
  }

  // Handle empty state
  if (validIds.length === 0) {
    return (
      <div
        className={cn("reference-field", "reference-field-empty", className)}
        data-testid="reference-field"
      >
        <div className={cn("reference-field-content", contentClassName)}>
          <span className="empty-text" data-testid="reference-field-empty">
            {emptyText}
          </span>
        </div>
      </div>
    );
  }

  // Handle no data state
  if (!data) {
    return (
      <div
        className={cn("reference-field", "reference-field-no-data", className)}
        data-testid="reference-field"
      >
        <div className={cn("reference-field-content", contentClassName)}>
          <span className="no-data-text" data-testid="reference-field-no-data">
            No data available
          </span>
        </div>
      </div>
    );
  }

  // Determine what to display
  const displayData = isMultiple ? data : [data];
  const limitedData = maxItems ? displayData.slice(0, maxItems) : displayData;

  // Type assertion for limitedData to ensure type safety
  const typedLimitedData = limitedData as ReferenceData[];

  // Custom renderer takes precedence
  if (render) {
    return (
      <div
        className={cn("reference-field", className)}
        data-testid="reference-field"
        aria-required={required || undefined}
      >
        <div className={cn("reference-field-content", contentClassName)}>
          {render(isMultiple ? limitedData : limitedData[0])}
        </div>
      </div>
    );
  }

  // Default rendering based on source field
  const renderReference = (item: ReferenceData) => {
    const displayValue = item[source] || item.id || "Unknown";

    if (showLink && linkRenderer) {
      return linkRenderer(item.id, item);
    }

    if (showLink) {
      return (
        <a
          href={`/${reference}/${item.id}`}
          className="reference-link"
          data-testid="reference-link"
        >
          {displayValue}
        </a>
      );
    }

    return (
      <span className="reference-value" data-testid="reference-value">
        {displayValue}
      </span>
    );
  };

  // Render multiple references
  if (isMultiple || limitedData.length > 1) {
    if (showAsList) {
      return (
        <div
          className={cn("reference-field", className)}
          data-testid="reference-field"
          aria-required={required || undefined}
        >
          <div className={cn("reference-field-content", contentClassName)}>
            <ul className="reference-list">
              {typedLimitedData.map((item: ReferenceData, index: number) => (
                <li key={item.id || index} className="reference-item">
                  {renderReference(item)}
                </li>
              ))}
            </ul>
            {maxItems && displayData.length > maxItems && (
              <span className="reference-more">
                +{displayData.length - maxItems} more
              </span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        className={cn("reference-field", className)}
        data-testid="reference-field"
        aria-required={required || undefined}
      >
        <div className={cn("reference-field-content", contentClassName)}>
          {typedLimitedData.map((item: ReferenceData, index: number) => (
            <React.Fragment key={item.id || index}>
              {renderReference(item)}
              {index < typedLimitedData.length - 1 && (
                <span className="reference-separator">{separator}</span>
              )}
            </React.Fragment>
          ))}
          {maxItems && displayData.length > maxItems && (
            <span className="reference-more">
              +{displayData.length - maxItems} more
            </span>
          )}
        </div>
      </div>
    );
  }

  // Render single reference
  return (
    <div
      className={cn("reference-field", className)}
      data-testid="reference-field"
      aria-required={required || undefined}
    >
      <div className={cn("reference-field-content", contentClassName)}>
        {renderReference(typedLimitedData[0])}
      </div>
    </div>
  );
};

ReferenceField.displayName = "ReferenceField";
