"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationEllipsis = exports.PaginationNext = exports.PaginationPrevious = exports.PaginationItem = exports.PaginationLink = exports.PaginationContent = exports.Pagination = void 0;
const React = __importStar(require("react"));
const react_icons_1 = require("@radix-ui/react-icons");
const utils_1 = require("@/lib/utils");
const button_1 = require("@/components/ui/button");
const Pagination = ({ className, ...props }) => (<nav role="navigation" aria-label="pagination" className={(0, utils_1.cn)('mx-auto flex w-full justify-center', className)} {...props}/>);
exports.Pagination = Pagination;
Pagination.displayName = 'Pagination';
const PaginationContent = React.forwardRef(({ className, ...props }, ref) => (<ul ref={ref} className={(0, utils_1.cn)('flex flex-row items-center gap-1', className)} {...props}/>));
exports.PaginationContent = PaginationContent;
PaginationContent.displayName = 'PaginationContent';
const PaginationItem = React.forwardRef(({ className, ...props }, ref) => (<li ref={ref} className={(0, utils_1.cn)('', className)} {...props}/>));
exports.PaginationItem = PaginationItem;
PaginationItem.displayName = 'PaginationItem';
const PaginationLink = ({ className, isActive, size = 'icon', ...props }) => (<a aria-current={isActive ? 'page' : undefined} className={(0, utils_1.cn)((0, button_1.buttonVariants)({
        variant: isActive ? 'outline' : 'ghost',
        size,
    }), className)} {...props}/>);
exports.PaginationLink = PaginationLink;
PaginationLink.displayName = 'PaginationLink';
const PaginationPrevious = ({ className, ...props }) => (<PaginationLink aria-label="Go to previous page" size="default" className={(0, utils_1.cn)('gap-1 pl-2.5', className)} {...props}>
    <react_icons_1.ChevronLeftIcon className="h-4 w-4"/>
    <span>Previous</span>
  </PaginationLink>);
exports.PaginationPrevious = PaginationPrevious;
PaginationPrevious.displayName = 'PaginationPrevious';
const PaginationNext = ({ className, ...props }) => (<PaginationLink aria-label="Go to next page" size="default" className={(0, utils_1.cn)('gap-1 pr-2.5', className)} {...props}>
    <span>Next</span>
    <react_icons_1.ChevronRightIcon className="h-4 w-4"/>
  </PaginationLink>);
exports.PaginationNext = PaginationNext;
PaginationNext.displayName = 'PaginationNext';
const PaginationEllipsis = ({ className, ...props }) => (<span aria-hidden className={(0, utils_1.cn)('flex h-9 w-9 items-center justify-center', className)} {...props}>
    <react_icons_1.DotsHorizontalIcon className="h-4 w-4"/>
    <span className="sr-only">More pages</span>
  </span>);
exports.PaginationEllipsis = PaginationEllipsis;
PaginationEllipsis.displayName = 'PaginationEllipsis';
