#!/usr/bin/env node

/**
 * PWA Icon Generator
 * Generates all required PWA icon sizes from a source SVG file
 *
 * Usage: node scripts/generate-icons.js
 */

const fs = require('fs')
const path = require('path')

// Required icon sizes for PWA
const ICON_SIZES = [72, 96, 128, 144, 152, 180, 192, 384, 512]

const SOURCE_SVG = path.join(__dirname, '../public/icon.svg')
const OUTPUT_DIR = path.join(__dirname, '../public/icons')
const MANIFEST_PATH = path.join(__dirname, '../public/manifest.json')

// Check if sharp is installed
let sharp
try {
  sharp = require('sharp')
} catch (error) {
  console.error('⚠️  Sharp is not installed. Installing now...')
  console.log('Run: npm install --save-dev sharp')
  console.log('\nAlternatively, use online tools to generate icons:')
  console.log('- https://www.pwabuilder.com/imageGenerator')
  console.log('- https://realfavicongenerator.net/')
  process.exit(1)
}

/**
 * Create output directory if it doesn't exist
 */
function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`✅ Created directory: ${dir}`)
  }
}

/**
 * Generate PNG icon from SVG
 */
async function generateIcon(size) {
  const outputPath = path.join(OUTPUT_DIR, `icon-${size}.png`)

  try {
    await sharp(SOURCE_SVG)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 102, g: 126, b: 234, alpha: 1 }
      })
      .png({ quality: 95, compressionLevel: 9 })
      .toFile(outputPath)

    console.log(`✅ Generated ${size}x${size} icon`)
  } catch (error) {
    console.error(`❌ Failed to generate ${size}x${size} icon:`, error.message)
  }
}

/**
 * Update manifest.json with icon paths
 */
function updateManifest() {
  try {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))

    // Generate icons array
    manifest.icons = ICON_SIZES.map(size => ({
      src: `/icons/icon-${size}.png`,
      sizes: `${size}x${size}`,
      type: 'image/png',
      purpose: size >= 192 ? 'any maskable' : 'any'
    }))

    // Write updated manifest
    fs.writeFileSync(
      MANIFEST_PATH,
      JSON.stringify(manifest, null, 2) + '\n',
      'utf8'
    )

    console.log('✅ Updated manifest.json with icon paths')
  } catch (error) {
    console.error('❌ Failed to update manifest.json:', error.message)
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 PWA Icon Generator')
  console.log('━'.repeat(50))

  // Check if source SVG exists
  if (!fs.existsSync(SOURCE_SVG)) {
    console.error(`❌ Source SVG not found: ${SOURCE_SVG}`)
    process.exit(1)
  }

  console.log(`📄 Source: ${SOURCE_SVG}`)
  console.log(`📁 Output: ${OUTPUT_DIR}`)
  console.log('')

  // Create output directory
  ensureDirectoryExists(OUTPUT_DIR)

  // Generate all icons
  console.log('Generating icons...')
  for (const size of ICON_SIZES) {
    await generateIcon(size)
  }

  console.log('')
  console.log('Updating manifest.json...')
  updateManifest()

  console.log('')
  console.log('━'.repeat(50))
  console.log('✅ Icon generation complete!')
  console.log('')
  console.log('Next steps:')
  console.log('1. Review generated icons in public/icons/')
  console.log('2. Test PWA installation: npm run preview')
  console.log('3. Verify icons in DevTools → Application → Manifest')
}

// Run main function
main().catch(error => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
