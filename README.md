# PDF Tools

A modern, user-friendly web application for merging and splitting PDF files. Built with React, Material-UI, and real-time previews. All processing happens in your browser for maximum privacy and speed.

## ✨ Features

### 📄 PDF Merger
- **📁 Multiple File Upload**: Upload multiple PDF files at once
- **🔄 Drag & Drop Reordering**: Intuitively reorder PDFs using drag-and-drop
- **👀 Real-time Previews**: See previews of all uploaded PDFs
- **📄 Blank Page Insertion**: Option to add blank pages between each PDF
- **📝 Custom Filename**: Set a custom name for the merged output file
- **🎨 Drag & Drop Upload**: Drag files directly onto the upload area

### ✂️ PDF Splitter
- **📄 Single File Upload**: Upload a single PDF file to split
- **📊 Page Range Selection**: Define custom page ranges for splitting
- **🔢 Multiple Split Ranges**: Create multiple parts from one PDF
- **👀 Real-time Previews**: Preview each split part before downloading
- **📝 Custom Part Names**: Name each split part individually
- **🎨 Drag & Drop Upload**: Drag files directly onto the upload area

### 🌟 General Features
- **🔒 Privacy-Focused**: All processing happens in your browser - no files uploaded to servers
- **⚡ Lightning Fast**: Client-side processing means instant results
- **📱 Responsive Design**: Works perfectly on desktop and mobile devices
- **🎨 Modern UI**: Clean, intuitive interface built with Material-UI
- **🔄 Real-time Updates**: See changes instantly as you configure options

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pdf-merger
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to use the application

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📖 How to Use

### PDF Merger
1. **Navigate to PDF Merger**: Click "Start Merging" on the landing page
2. **Upload PDFs**: Click the upload area or drag and drop PDF files
3. **Configure Options** (optional):
   - Toggle "Add blank page between each PDF" if you want separators
   - Enter a custom filename (defaults to "merged.pdf")
4. **Reorder Files**: Drag and drop the PDF items to arrange them in your desired order
5. **Preview**: View previews of your PDFs on the right side
6. **Merge**: Click "Merge PDFs" to download your combined document

### PDF Splitter
1. **Navigate to PDF Splitter**: Click "Start Splitting" on the landing page
2. **Upload PDF**: Click the upload area or drag and drop a single PDF file
3. **Configure Split Ranges**:
   - Set start and end pages for each part
   - Add multiple ranges if needed
   - Name each part individually
4. **Preview**: View previews of each split part on the right side
5. **Split**: Click "Split PDF" to download all parts

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **UI Framework**: Material-UI (MUI)
- **PDF Processing**: pdf-lib
- **Drag & Drop**: @dnd-kit
- **Development**: ESLint, PostCSS

## 📁 Project Structure

```
pdf-merger/
├── src/
│   ├── components/
│   │   ├── LandingPage.jsx     # Landing page with tool selection
│   │   ├── PDFMerger.jsx       # PDF merger component
│   │   ├── PDFSplitter.jsx     # PDF splitter component
│   │   └── SortablePDFItem.jsx # Individual PDF item component
│   ├── App.jsx                 # Root application component
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles
├── public/                    # Static assets
│   ├── logo.svg              # Application logo
│   └── logo-large.svg        # Large application logo
├── package.json              # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── tailwind.config.js       # Tailwind CSS configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🐳 Docker Support

The project includes a Dockerfile for containerized deployment:

```bash
# Build the Docker image
docker build -t pdf-tools .

# Run the container
docker run -p 3000:3000 pdf-tools
```

## 🎨 UI/UX Features

- **Landing Page**: Beautiful landing page with tool selection
- **Material Design**: Consistent Material-UI components throughout
- **Drag & Drop**: Intuitive file upload and reordering
- **Real-time Previews**: Instant preview of PDFs and split parts
- **Responsive Layout**: Works on all screen sizes
- **Error Handling**: Clear error messages and validation
- **Loading States**: Visual feedback during processing

## 🔒 Privacy & Security

- **Client-side Processing**: All PDF operations happen in your browser
- **No Server Uploads**: Files never leave your device
- **No Data Collection**: We don't collect or store any user data
- **Open Source**: Transparent codebase for security review

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- Large PDF files may take longer to process
- Some complex PDF layouts might not render perfectly in previews
- Browser compatibility: Works best in modern browsers (Chrome, Firefox, Safari, Edge)

## 🚀 Future Enhancements

- PDF to image conversion
- Image to PDF conversion
- PDF compression
- Password protection
- Digital signatures
- OCR text extraction

## 📞 Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/)
- UI components from [Material-UI](https://mui.com/)
- PDF processing with [pdf-lib](https://pdf-lib.js.org/)
- Drag and drop functionality with [@dnd-kit](https://dndkit.com/)