// Collision detection using the separating Axis Theorem

abstract class CollisionDetection {

    public static collide(playerOne: Player, playerTwo: Player, screen : PlayScreen) {
        // Defining hitboxes
        let currentHitboxOne = playerOne.hitbox.getCurrentHitbox(Vector2.add(playerOne.position, playerOne.velocity));
        let currentHitboxTwo = playerTwo.hitbox.getCurrentHitbox(Vector2.add(playerTwo.position, playerTwo.velocity));

        let overlapX : number = Math.min(currentHitboxOne.maxX, currentHitboxTwo.maxX) - Math.max(currentHitboxOne.minX, currentHitboxTwo.minX);
        let overlapY : number = Math.min(currentHitboxOne.maxY, currentHitboxTwo.maxY) - Math.max(currentHitboxOne.minY, currentHitboxTwo.minY);


        // If there is potential overlap
        if (overlapX > 0 && overlapY > 0) {

            let overlap = Math.min(overlapX, overlapY);
            let normal : Vector2;

            // Set normal
            if (overlap == overlapX) {
                    normal = new Vector2(1, 0);
            }
            else {
                // If player one is left
                if (playerOne.newPosition.y < playerTwo.newPosition.y) {
                    normal = new Vector2(0, 1);
                } else {
                    normal = new Vector2(0, -1);
                }
            }

            // If both hitboxes are convex hitboxes
            if (currentHitboxOne instanceof ConvexHitbox || currentHitboxTwo instanceof ConvexHitbox) {
                // Separating axis theorem stuff starts here!

                const uniqueNormals: number[] = [];

                // Get all useful normals
                for (let i = 0; i < 2; i++) {
                    let currentHitbox : HitboxBase;
                    if (i === 1) currentHitbox = currentHitboxOne;
                    else currentHitbox = currentHitboxTwo;

                    if (currentHitbox instanceof ConvexHitbox) {
                        for (let i = 0; currentHitboxOne.vectorAmount > i; i++) {
                            const currentNormal = currentHitbox.getNormal(i);
                            if (uniqueNormals.indexOf(currentNormal) === -1 && // If new normal is not already in the array
                                currentNormal !== Infinity && currentNormal !== -Infinity && currentNormal !== 0) // If normal is worth checking (straight up or down does not need checking)
                            {
                                uniqueNormals.push(currentNormal);
                            }
                        }
                    }
                }

                // Get overlap or return when separation is found
                for (let n = 0; n < uniqueNormals.length; n++) {
                    let minHb1 = Infinity; let maxHb1 = -Infinity;
                    for (let v = 0; v < currentHitboxOne.vectorAmount; v++) {
                        // Simplified form of getting overlap, because the x of the normal is always one
                        const current : number = (currentHitboxOne.vectors[v].x + currentHitboxOne.vectors[v].y * uniqueNormals[n]);
                        minHb1 = Math.min(minHb1, current);
                        maxHb1 = Math.max(maxHb1, current);
                    }

                    let minHb2 = Infinity; let maxHb2 = -Infinity;
                    for (let v = 0; v < currentHitboxTwo.vectorAmount; v++) {
                        // Simplified form of getting overlap, because the x of the normal is always one
                        const current : number = (currentHitboxTwo.vectors[v].x + currentHitboxTwo.vectors[v].y * uniqueNormals[n]);
                        minHb2 = Math.min(minHb2, current);
                        maxHb2 = Math.max(maxHb2, current);
                    }

                    const currentOverlap = Math.min(maxHb1, maxHb2) - Math.max(minHb1, minHb2);

                    if (currentOverlap <= 0) {
                        // There is no overlap
                        return;
                    }

                    // Store lowest overlap and its normal
                    if (currentOverlap < overlap) {
                        overlap = currentOverlap;
                        normal = new Vector2(1, uniqueNormals[n]);
                    }

                }

            }

            // Invert normal if player is on the other side, but don't invert if normal is straight up or down
            if (currentHitboxOne.minX > currentHitboxTwo.minX && normal.x != 0) {
                normal.x *= -1;
                normal.y *= -1;
                console.log("test")
            } else if (normal.y == 1) { // Give players ability to jump off of one another
                playerTwo.isOnGround = true;
            } else if (normal.y == -1) {
                playerOne.isOnGround = true;
            }

            // Set additional velocity
            const s : number = Math.sqrt(1 + normal.y * normal.y);
            //console.log(s)
            const x : number = (overlap * normal.x / s) / 2;
            const y : number = (overlap * normal.y / s) / 2;

            const addVelocityOne : Vector2 = new Vector2(-x, -y);
            const addVelocityTwo : Vector2 = new Vector2(x, y);


            // Set hitboxes to new position
            currentHitboxOne = currentHitboxOne.getCurrentHitbox(addVelocityOne)
            currentHitboxTwo = currentHitboxTwo.getCurrentHitbox(addVelocityTwo)

            // Prevent players from crossing the borders
            // If colliding with walls
            let overBorder : number = Math.min(currentHitboxOne.minX, currentHitboxTwo.minX)
            if (overBorder < 0) {
                addVelocityOne.x -= overBorder;
                addVelocityTwo.x -= overBorder;
            }
            else {
                overBorder = Math.max(currentHitboxOne.maxX, currentHitboxTwo.maxX) - 100;
                if (overBorder > 0) {
                    addVelocityOne.x -= overBorder;
                    addVelocityTwo.x -= overBorder;
                }
            }
            // If colliding with floor or ceiling
            overBorder = Math.min(currentHitboxOne.minY, currentHitboxTwo.minY) - screen.floorHeight;
            if (overBorder < 0) {
                addVelocityOne.y -= overBorder;
                addVelocityTwo.y -= overBorder;
            }
            else {
                overBorder = Math.max(currentHitboxOne.maxY, currentHitboxTwo.maxY) - gameHeightInVw;
                if (overBorder > 0) {
                    addVelocityOne.y -= overBorder;
                    addVelocityTwo.y -= overBorder;
                }
            }

            // Add new velocities
            playerOne.velocity.add(addVelocityOne);
            playerTwo.velocity.add(addVelocityTwo);
        }
        else {
            if (currentHitboxOne.minY > screen.floorHeight) {
                playerOne.isOnGround = false;
            }
            if (currentHitboxTwo.minY > screen.floorHeight) {
                playerTwo.isOnGround = false;
            }
        }
    }
}