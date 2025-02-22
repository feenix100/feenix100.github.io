// Basic setup
// this is a digital representation of a physical warehouse
// the part_numbers array contains the numbers that are associated with machine parts in the physical warehouse 

function setupThreeJS() {
    // Create and setup the scene
    const scene = new THREE.Scene();

    // Create and setup the camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 20, 100);

    // Create and setup the renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create and setup the controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;

    return { scene, camera, renderer, controls };
}

// Initialize scene, camera, renderer, and controls
const { scene, camera, renderer, controls } = setupThreeJS();


// Lighting setup

function createBackgroundTexture() {
    const width = 512;
    const height = 512;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');

    // Create gradient
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#000033'); // Deep blue (top)
    gradient.addColorStop(1, '#000080'); // Lighter blue (bottom)

    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
}

function addLighting() {
    // Create starry night gradient background
    const BackGroundTexture = createBackgroundTexture();
    scene.background = BackGroundTexture;

    // Ambient light with lower intensity
    const ambientLight = new THREE.AmbientLight(0x404040, 0.2); // Reduced intensity for a darker scene
    scene.add(ambientLight);

    // Hemisphere light with lower intensity
    const hemisphereLight = new THREE.HemisphereLight(0x333366, 0x111111, 0.3); // Dim sky and ground colors with lower intensity
    scene.add(hemisphereLight);

    // Sunlight simulation with reduced intensity
    const sunlight = new THREE.DirectionalLight(0xffffff, 1.0); // Lower intensity
    sunlight.position.set(50, 100, 50); // Position it to cast light from a high angle
    sunlight.castShadow = true;

    // Shadow properties for deeper shadows
    sunlight.shadow.camera.near = 1;
    sunlight.shadow.camera.far = 150;
    sunlight.shadow.camera.left = -100;
    sunlight.shadow.camera.right = 100;
    sunlight.shadow.camera.top = 100;
    sunlight.shadow.camera.bottom = -100;
    sunlight.shadow.mapSize.width = 8192; // Higher resolution shadow map
    sunlight.shadow.mapSize.height = 8192;
    sunlight.shadow.bias = -0.01; // Fine-tuned bias for better shadow quality

    scene.add(sunlight);

    // Point light with lower intensity
    const pointLight = new THREE.PointLight(0xffa500, 0.3, 50); // Reduced intensity for a subtler effect
    pointLight.position.set(-30, 40, 30); // Position it to highlight specific areas
    scene.add(pointLight);

    // Spot light with adjusted settings for more dramatic shadows
    const spotLight = new THREE.SpotLight(0xffffff, 0.5); // Reduced intensity
    spotLight.position.set(0, 50, 0); // Position it from above
    spotLight.angle = Math.PI / 6; // Narrower cone for more focused light
    spotLight.penumbra = 0.3; // Slightly softer edges
    spotLight.decay = 2; // How light fades over distance
    spotLight.distance = 100;
    spotLight.castShadow = true;

    // Shadow properties for the spot light
    spotLight.shadow.camera.near = 10;
    spotLight.shadow.camera.far = 150;
    spotLight.shadow.camera.fov = 40; // Field of view of the shadow camera
    spotLight.shadow.mapSize.width = 4096; // Shadow map size
    spotLight.shadow.mapSize.height = 4096;
    scene.add(spotLight);
}


function addAxesHelper(length, linewidth, x, y, z) {
    const axesHelper = new THREE.AxesHelper(length);
    axesHelper.material.linewidth = linewidth;
    axesHelper.position.set(x, y, z);
    scene.add(axesHelper);
}

addLighting();

// Axes helper setup
addAxesHelper(20, 7, 0, 10, 0);

// Raycaster for detecting clicks
// detects where rays intersect with position of mouse click

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Shelf dimensions
const shelfHeight = 1;
const shelfDepth = 3;

// Define dimensions for shelves
const shelfDimensions = {
    regular: { width: 10, length: 1 },
    rotated: { width: 10, length: 1 },
    extraLong: { width: 50, length: 10 } // Custom width and length for extra-long shelves
};

// Numbers for machine parts on shelf sets
const part_numbers = [
    [1, 2, 3, 4, 5],    // Mid section Shelf 1
    [6, 7, 8, 9, 10],   // Mid section Shelf 2
    [11, 12, 13, 14, 15],  // Mid section Shelf 3
    [16, 17, 18, 19, 20],  // Mid section Shelf 4
    [1, 2, 3, 4, 5],    // Mid section Shelf 5
    [6, 7, 8, 9, 10],   // Mid section Shelf 6
    [11, 12, 13, 14, 15],  // Mid section Shelf 7

    [16, 17, 18, 19, 20],  // Top Shelf 1
    [1, 2, 3, 4, 5],    // Top Shelf 2
    [6, 7, 8, 9, 10],   // Top Shelf 3
    [11, 12, 13, 14, 15],  // Top Shelf 4

    [2007, 2008, 2018, 2028, 2032, 2030, 2640, 2641, 3545, 3549, 3556, 5135, 5156, 5207, 5280, 5283, 5356, 5385, 5395, 5912, 5920, 5936, 5940, 6699, 6700, 6709, 6710, 6713, 6717, 8508, 8511, 8512, 9243, 9244, 9421, 9422],  // Row 1 fuel section
    [11268, 9199, 20583, 20584, 9900, 9901, 9424, 9484, 9485, 9486, 10003, 10843, 11235, 11236, 11263, 11258, 12043, 12044, 12046, 12048, 12509, 13132, 15113, 15114, 15535, 15536, 16806, 16416, 17549, 17550, 17551, 17552, 18515, 20466, 20905, 21979, 22597, 22806, 22807, 22910, 23149, 23944, 23945, 23991, 23992, 24286, 29368, 29690, 30389, 31557, 31652, 26927],  // Row 2 fuel section
    [33709, 38808, 34480, 41349, 43322, 43587, 46559, 45940, 46888, 49196, 51328, 54513, 53258, 55060, 57789, 57552, 58214, 58256, 58632, 61335, 61336, 61338, 57646, 65244, 67884, 61832, 63710, 66369, 66370, 68531, 69888],  // Row 3 fuel section
    [67235, 67712, 69128, 71244, 75197, 76072, 79104, 82091, 85896, 92547, 93198, 100431, 103874, 104479, 110088, 34479, 36327, 36328, 36329, 36331, 36767, 88295],  // Row 4 fuel section
    [12500, 99324, 99325, 99323, 99885, 103103, 34730],  // Row 5 fuel section

    [169848, 15470, 151458, 1549, 2410],  // long Shelf 1
    [1455, 5412, 54153, 5454, 5445],    // long Shelf 2
    [54546, 1766, 8844, 9541, 1011],   // long Shelf 3
    
];

let shelfSets = []; // Array to hold groups of shelves

// Arrays for different shelf set names
const midsectionNames = [];
const topSectionNames = [];
const fuelSectionNames = [];
const extraLongShelfNames = [
    "East_Shelf", 
    "South Shelf", 
    "heater_Rod_Shelf_South_Corner"
];

// Midsection names
for (let i = 0; i < 7; i++) {
    midsectionNames.push(`Row_${i + 1}_Midsection`);
}

// Top section names
for (let i = 0; i < 4; i++) {
    topSectionNames.push(`Row_${i + 1}_Top_Section`);
}

// Fuel section names
for (let i = 0; i < 5; i++) {
    fuelSectionNames.push(`Row_${i + 1}_Fuel_Section`);
}

// Function to create shelves
function createShelves(positions) {
    const spaceBetweenSets = 2; // Reduced space between each set
    const spaceBetweenShelves = 5; // Space between each shelf in a set

    // Ensure we have enough part numbers arrays to assign to each shelf group
    if (positions.length > part_numbers.length) {
        console.error('Not enough part numbers arrays to assign to each shelf group.');
        return;
    }

    positions.forEach((position, i) => {
        const { startX, startZ, shelfType, shelfSetName, setIndex } = position;
        const shelfGroup = new THREE.Group();
        shelfGroup.position.set(startX, 0, startZ); // Set initial position
        const shelf_set_Height_Max = 5; // Set the max height of each shelf set

        for (let j = 0; j < shelf_set_Height_Max; j++) {
            let shelfWidth, shelfLength;

            if (shelfType === 'rotated') {
                shelfWidth = shelfDimensions.rotated.width;
                shelfLength = shelfDimensions.rotated.length;
                shelfGroup.rotation.y = Math.PI / 2; // Rotate shelf 90 degrees if it's rotated
            } else if (shelfType === 'extraLong') {
                shelfWidth = shelfDimensions.extraLong.width;
                shelfLength = shelfDimensions.extraLong.length;
            } else if (shelfType === 'extraLong_Rotated') {
                shelfWidth = shelfDimensions.extraLong.width;
                shelfLength = shelfDimensions.extraLong.length;
                shelfGroup.rotation.set(0, Math.PI / 2, 0);
            } else {
                shelfWidth = shelfDimensions.regular.width;
                shelfLength = shelfDimensions.regular.length;
            }

            const geometry = new THREE.BoxGeometry(shelfWidth, shelfHeight, shelfDepth);
            const material = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
            const shelf = new THREE.Mesh(geometry, material);

            const startY = j * (shelfHeight + spaceBetweenShelves);
            shelf.position.set(0, startY, 0);

            // Assign a unique name to each shelf in the format 'shelf-setIndex-shelfIndex'
            shelf.name = `shelf-${setIndex}-${j}`;

            // Attach part numbers to shelf user data
            const partNumbers = (shelfGroup.userData.partNumbers || [])[j] || [];
            shelf.userData.partNumbers = partNumbers;

            shelfGroup.add(shelf);
        }

        // Create a label for the shelf set
        let label = `${shelfSetName}`;
        if (shelfType === 'rotated') {
            label += ' (Rotated)';
        }
        createShelfLabel(shelfGroup, label, shelf_set_Height_Max * (shelfHeight + spaceBetweenShelves) + 2);

        // Assign part numbers array to the group
        const partNumbersForGroup = part_numbers[i] || [];
        shelfGroup.userData.partNumbers = partNumbersForGroup;

        scene.add(shelfGroup);
        shelfSets.push(shelfGroup); // Add group to array
    });
}

// Function to create labels for shelf sets
function createShelfLabel(group, text, yPosition) {
    const loader = new THREE.FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
        const textGeometry = new THREE.TextGeometry(text, {
            font: font,
            size: 0.5,
            height: 0.1,
        });

        // Calculate text size for background plane
        const textSize = new THREE.Box3().setFromObject(new THREE.Mesh(textGeometry)).getSize(new THREE.Vector3());

        const backgroundGeometry = new THREE.PlaneGeometry(textSize.x + 0.2, textSize.y + 0.2); // Adjust padding
        const backgroundMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White background
        const backgroundPlane = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
        backgroundPlane.position.set(0, yPosition + 0.3, 0); // Position behind the text
        group.add(backgroundPlane);

        const textMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black text
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);

        textMesh.position.set(-(textSize.x + 0.2) / 2, yPosition, 0); // Center text on background plane
        textMesh.rotation.set(0, 0, 0); // Ensure text faces the camera

        group.add(textMesh);
    });
}

// Initialize empty array
// Shelf positions for regular, rotated, and extra-long shelves 
const positions = [];

// Define the mapping of part numbers to each shelf set
const shelfSetPartNumbers = {
    0: part_numbers.slice(0, 6), // Midsection Shelves
    1: part_numbers.slice(7, 11), // Top Section Shelves
    2: part_numbers.slice(12, 16), // Fuel Sections Shelves
    3: part_numbers.slice(16) // Additional Sections (e.g., Extra-long shelves)
};


// shelf types extraLong_Rotated, regular, rotated, extraLong
// Create positions for Midsections
for (let i = 0; i < midsectionNames.length; i++) {
    positions.push({ startX: -30, startZ: -60 + 10 * i, shelfType: 'regular', shelfSetName: midsectionNames[i], setIndex: 0 });
}

// Create positions for Top Sections
for (let i = 0; i < topSectionNames.length; i++) {
    positions.push({ startX: -10, startZ: -60 + 10 * i, shelfType: 'regular', shelfSetName: topSectionNames[i], setIndex: 1 });
}

// Create positions for Fuel Sections
for (let i = 0; i < fuelSectionNames.length; i++) {
    positions.push({ startX: -50, startZ: 50 + 10 * i, shelfType: 'regular', shelfSetName: fuelSectionNames[i], setIndex: 2 });
}

// create positions for extra long shelves  shelf types extraLong_Rotated, regular, rotated, extraLong
positions.push({ startX: -80, startZ: 50, shelfType: 'extraLong_Rotated', shelfSetName: extraLongShelfNames [0], setIndex: 3 });

// create positions for extra long shelves  shelf types extraLong_Rotated, regular, rotated, extraLong
//positions.push({ startX: 0, startZ: -50, shelfType: 'extraLong', shelfSetName: extraLongShelfNames [1], setIndex: 3 });

// create positions for extra long shelves  shelf types extraLong_Rotated, regular, rotated, extraLong
positions.push({ startX: 0, startZ: -90, shelfType: 'extraLong', shelfSetName: extraLongShelfNames [2], setIndex: 3 });

// Function to create the desk
function createDesk() {
    // Desk dimensions
    const deskWidth = 20;
    const deskHeight = 0.5;
    const deskDepth = 10;
    const legHeight = 7;
    const legThickness = 0.5;

    // Desk geometry and material
    const deskGeometry = new THREE.BoxGeometry(deskWidth, deskHeight, deskDepth);
    const deskMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown color for the desk
    const desk = new THREE.Mesh(deskGeometry, deskMaterial);
    
    // Set the desk's position and rotation
    const deskPosition = new THREE.Vector3(80, legHeight + deskHeight / 2, 0);
    const deskRotation = Math.PI / 2; // Example rotation of 90 degrees (π/2 radians)
    desk.position.copy(deskPosition);
    desk.rotation.y = deskRotation;

    // Leg geometry and material
    const legGeometry = new THREE.BoxGeometry(legThickness, legHeight, legThickness);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x4B3B2A }); // Darker brown for the legs

    // Create four legs and position them relative to the rotated desk
    const createLeg = (xOffset, zOffset) => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);

        // Calculate leg position relative to desk center
        const legOffset = new THREE.Vector3(xOffset, -deskHeight / 2 - legHeight / 2, zOffset);
        legOffset.applyMatrix4(new THREE.Matrix4().makeRotationY(deskRotation)); // Apply rotation
        legOffset.add(deskPosition); // Apply position

        leg.position.copy(legOffset);
        return leg;
    };

    // Position of legs relative to the desk's center
    const leg1 = createLeg(-deskWidth / 2 + legThickness / 2, -deskDepth / 2 + legThickness / 2);
    const leg2 = createLeg(deskWidth / 2 - legThickness / 2, -deskDepth / 2 + legThickness / 2);
    const leg3 = createLeg(-deskWidth / 2 + legThickness / 2, deskDepth / 2 - legThickness / 2);
    const leg4 = createLeg(deskWidth / 2 - legThickness / 2, deskDepth / 2 - legThickness / 2);

    // Add desk and legs to the scene
    scene.add(desk);
    scene.add(leg1);
    scene.add(leg2);
    scene.add(leg3);
    scene.add(leg4);
}

// Function to search part numbers
function searchPartNumber() {
    //select the html elements
    const searchInput = document.getElementById('searchInput');
    const searchResult = document.getElementById('searchResult');
    const shelfNameDiv = document.getElementById('shelfName');

    //search the part_number arrays for the input value
    const partNumber = searchInput.value.trim();

    // Clear previous highlights and shelf name
    shelfSets.forEach(group => {
        group.traverse(child => {
            if (child instanceof THREE.Mesh) {
                child.material.color.set('#8B4513'); // Reset shelf color to default
            }
        });
    });
    shelfNameDiv.innerHTML = '';

    if (partNumber === '') {
        searchResult.innerHTML = 'Please enter a part number.';
        return;
    }

    // Search through part_numbers array
    let found = false;
    for (const [index, group] of part_numbers.entries()) {
        if (group.includes(Number(partNumber))) {
            
            // Highlight the shelf group
            const shelfGroup = shelfSets[index];
            shelfGroup.traverse(child => {
                if (child instanceof THREE.Mesh) {
                    child.material.color.set('#ff0000'); // Highlight the shelf
                }
            });
            // display search result with shelf name
            
            searchResult.innerHTML = `Part number ${partNumber} is on ${shelfSetNames[index]}.`;
            
            found = true;
            break;
        }
    }

    if (!found) {
        searchResult.innerHTML = `Part number ${partNumber} not found.`;
    }
}


// Event listener for the search button
document.getElementById('searchButton').addEventListener('click', searchPartNumber);

// Optionally, handle "Enter" key press in the input box
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchPartNumber();
    }
});

// Event listener for the search button
document.getElementById('searchButton').addEventListener('click', searchPartNumber);

// Optionally, handle "Enter" key press in the input box
document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchPartNumber();
    }
});

// Function to create the floor
function createFloor() {
    // Floor plane
    const floorGeometry = new THREE.PlaneGeometry(200, 200); // Large plane
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White floor
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
    floor.position.y = -0.1; // Position slightly below origin to ensure it's visible
    scene.add(floor);

    // Add grid helper
    const gridHelper = new THREE.GridHelper(200, 20); // Size and divisions of the grid
    gridHelper.position.y = -0.1; // Position same as floor to overlay
    scene.add(gridHelper);
}

// Call the functions
createFloor();
createDesk();
createShelves(positions);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}

// Event listener for mouse clicks
window.addEventListener('click', onMouseClick, false);

// Get reference to the info div
const infoDiv = document.getElementById('infoBox');

// Converts 3D coordinates to 2D
function toScreenPosition(obj, camera, renderer) {
    const vector = new THREE.Vector3();
    const widthHalf = 0.5 * renderer.domElement.width;
    const heightHalf = 0.5 * renderer.domElement.height;

    obj.updateMatrixWorld();
    vector.setFromMatrixPosition(obj.matrixWorld);
    vector.project(camera);

    vector.x = (vector.x * widthHalf) + widthHalf;
    vector.y = -(vector.y * heightHalf) + heightHalf;

    return {
        x: vector.x,
        y: vector.y
    };
}


// Handle mouse click
// Mapping of shelf sets to their names
const shelfSetNames = [
    ...midsectionNames, // 7 Midsection Shelves
    ...topSectionNames, // 4 Top Section Shelves
    ...fuelSectionNames, // 5 Fuel Section Shelves
    ...extraLongShelfNames // Extra-long Shelves
];

function onMouseClick(event) {
    event.preventDefault();

    // Convert mouse coordinates to normalized device coordinates (NDC)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update raycaster with the mouse coordinates
    raycaster.setFromCamera(mouse, camera);

    // Check for intersections with objects in the scene
    // this finds the coordinates of the intersection of the raycast and mouse click

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;

        // Check if the clicked object is a shelf
        if (clickedObject.name.startsWith('shelf-')) {
            // Retrieve the shelfGroup that contains the clicked shelf
            let parentGroup = clickedObject.parent;
            while (parentGroup && !(parentGroup instanceof THREE.Group)) {
                parentGroup = parentGroup.parent;
            }

            if (parentGroup) {
                // Retrieve part numbers for the entire group based on the group user data
                const partNumbersForGroup = parentGroup.userData.partNumbers || [];

                // Flatten the part numbers for the entire group into a single list
                const allPartNumbers = partNumbersForGroup.flat();

                // Function to format part numbers with 6 numbers per line
                function formatPartNumbers(numbers, perLine) {
                    let formatted = '';
                    for (let i = 0; i < numbers.length; i++) {
                        if (i > 0 && i % perLine === 0) {
                            formatted += '<br>';
                        }
                        formatted += numbers[i] + ' ';
                    }
                    return formatted.trim(); // Remove trailing space
                }

                // Format part numbers with 6 per line
                const formattedPartNumbers = formatPartNumbers(allPartNumbers, 6);

                // Determine the shelf set name based on the index
                const setIndex = shelfSets.indexOf(parentGroup);
                const shelfSetName = shelfSetNames[setIndex] || 'Unknown Shelf Set';

                // Update infoDiv content with formatted part numbers and shelf set name
                infoDiv.innerHTML = `<strong>${shelfSetName}</strong><br>${formattedPartNumbers}`;
                infoDiv.style.display = 'block';

                // Position infoDiv
                const { x, y } = toScreenPosition(clickedObject, camera, renderer);
                infoDiv.style.left = `${x}px`;
                infoDiv.style.top = `${y}px`;
                infoDiv.style.transform = 'translate(-50%, -100%)'; // Center the info box above the shelf
            }
        }
    }
}

//when mouse hovers above shelf, tooltip is engaged

let tooltip = document.createElement('div');
tooltip.style.position = 'absolute';
tooltip.style.background = 'rgba(0,0,0,0.7)';
tooltip.style.color = 'white';
tooltip.style.padding = '5px';
tooltip.style.borderRadius = '5px';
tooltip.style.display = 'none';
document.body.appendChild(tooltip);

function onMouseMove(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;

        if (intersectedObject.name.startsWith('shelf-')) {
            tooltip.style.display = 'block';
            
            // Determine the shelf set name based on the index
            let parentGroup = intersectedObject.parent;
            while (parentGroup && !(parentGroup instanceof THREE.Group)) {
                parentGroup = parentGroup.parent;
            }

            const setIndex = shelfSets.indexOf(parentGroup);
            const shelfSetName = shelfSetNames[setIndex] || 'Unknown Shelf Set';
            //tooltip is created when mouse hovers over shelf
            
            tooltip.innerText = `Shelf: ${shelfSetName}`;
            const { x, y } = toScreenPosition(intersectedObject, camera, renderer);
            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
        } else {
            tooltip.style.display = 'none';
        }
    } else {
        tooltip.style.display = 'none';
    }
}

window.addEventListener('mousemove', onMouseMove, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);

// Initial camera position
camera.position.set(0, 20, 100);

// Start the animation loop
animate();
